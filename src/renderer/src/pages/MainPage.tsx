import JsonSection from '@renderer/components/JsonSection'
import MyButton from '@renderer/components/MyButton'
import Progressbar from '@renderer/components/Progressbar'
import TeamsSection from '@renderer/components/TeamsSection'
import VideoSection from '@renderer/components/VideoSection'
import { TeamsData, TeamsForm } from '@renderer/types/teamsForm'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const NUMBER_OF_RECORDS = 20

export function MainPage() {
  const { register, handleSubmit } = useForm<TeamsForm>()

  const [scoresPath, setScoresPath] = useState<string | undefined>(undefined)
  const [scoresContent, setScoresContent] = useState<string | undefined>(undefined)
  const [videoPath, setVideoPath] = useState<string | undefined>(undefined)
  const [cliOutput, setCliOutput] = useState<string[]>([])
  const [percentage, setPercentage] = useState<number | undefined>(undefined)
  const [remainingTime, setRemainingTime] = useState<string | undefined>(undefined)
  const [homeColor, setHomeColor] = useState<string | undefined>('#00ff00')
  const [awayColor, setAwayColor] = useState<string | undefined>('#ff0000')

  const indexRef = useRef(0)

  const writeJsonFile = useCallback(async (data: TeamsData) => {
    try {
      const { ipcRenderer } = window.electron

      const result = await ipcRenderer.invoke('write-json-file', data)
      if (result.success) {
        console.log('JSON file written successfully')
      } else {
        console.error('Error writing JSON file:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }, [])

  const startContainer = async () => {
    try {
      const { ipcRenderer } = window.electron
      const result = await ipcRenderer.invoke(
        'copy-file',
        scoresPath,
        './public/rendering-assets/match-score.json'
      )
      if (result.success) {
        console.log('File copied successfully')
      } else {
        console.error('Error copying file:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    try {
      const { ipcRenderer } = window.electron
      const result = await ipcRenderer.invoke(
        'copy-file',
        videoPath,
        './public/rendering-assets/match-video.mp4'
      )
      if (result.success) {
        console.log('File copied successfully')
      } else {
        console.error('Error copying file:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    try {
      const { ipcRenderer } = window.electron
      await ipcRenderer.invoke('run-docker-container')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const stopContainer = useCallback(async () => {
    try {
      const { ipcRenderer } = window.electron
      await ipcRenderer.invoke('run-command', 'docker rm -f scoreboard_renderer')
      setCliOutput([])
      setPercentage(undefined)
      setRemainingTime(undefined)
      indexRef.current = 0
    } catch (error) {
      console.error('Error:', error)
    }
  }, [])

  const handleCliOutput = useCallback(async () => {
    try {
      const { ipcRenderer } = window.electron
      const result = await ipcRenderer.invoke(
        'run-command',
        'docker logs --since=0.1s scoreboard_renderer'
      )
      if (result.success) {
        const resultSplit = (result.output as string).split('Rendered')
        const resultNumbers = resultSplit[resultSplit.length - 1].split(',')
        if (resultNumbers[0]) {
          if (cliOutput.length !== NUMBER_OF_RECORDS) {
            setCliOutput([...cliOutput, resultNumbers[0]])
          } else {
            const newCliOutput = structuredClone(cliOutput)
            newCliOutput[indexRef.current] = resultNumbers[0]
            setCliOutput(newCliOutput)
          }
        }
      } else {
        console.error('Error retrieving logs', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }, [cliOutput])

  useEffect(() => {
    const interval = setInterval(handleCliOutput, 1000)
    return () => clearInterval(interval)
  }, [handleCliOutput])

  useEffect(() => {
    if (cliOutput.length > 0) {
      const resultForPercentage = cliOutput[indexRef.current].split('/')
      const currentPercentage = (
        (parseInt(resultForPercentage[0]) / parseInt(resultForPercentage[1])) *
        100
      ).toFixed(2)
      setPercentage(parseFloat(currentPercentage))

      const cliOutputPercentages = cliOutput.map((output) => {
        const resultForPercentage = output.split('/')
        return (parseInt(resultForPercentage[0]) / parseInt(resultForPercentage[1])) * 100
      })

      const cliOutputPercentagesSorted = cliOutputPercentages.sort((a, b) => a - b)

      const meanPercentages =
        cliOutputPercentagesSorted.reduce((acc, curr, currIndex, array) => {
          const percentageProgress = currIndex === 0 ? 0 : curr - array[currIndex - 1]
          // console.log({ acc, curr, currIndex, array, percentageProgress })
          return acc + percentageProgress
        }, 0) / cliOutput.length

      const remainingPercentage = 100 - parseFloat(currentPercentage)
      const remainingTimeInSeconds = remainingPercentage / meanPercentages

      const hours = Math.floor(remainingTimeInSeconds / 3600)
      const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60)
      const seconds = Math.floor(remainingTimeInSeconds % 60)
      const formattedTime = `${hours}h ${minutes}m ${seconds}s`
      setRemainingTime(formattedTime)

      console.log({
        cliOutput,
        cliOutputPercentages,
        cliOutputPercentagesSorted,
        meanPercentages,
        remainingTimeInSeconds
      })

      indexRef.current = (indexRef.current + 1) % NUMBER_OF_RECORDS
    }
  }, [cliOutput])

  const onSubmit: SubmitHandler<TeamsForm> = (data) => {
    if (cliOutput.length > 0) {
      stopContainer()
    } else {
      console.log({ data, homeColor, awayColor })
      writeJsonFile({ ...data, teamHomeColor: homeColor, teamAwayColor: awayColor })
      startContainer()
    }
    return
  }

  return (
    <form
      className="flex flex-col w-screen h-screen bg-slate-950"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col size-full gap-2">
        <TeamsSection
          register={register}
          awayColor={awayColor}
          homeColor={homeColor}
          setAwayColor={setAwayColor}
          setHomeColor={setHomeColor}
        />
        <JsonSection
          fileType="Scores"
          filePath={scoresPath}
          fileContent={scoresContent}
          setFilePath={setScoresPath}
          setFileContent={setScoresContent}
        />
        <VideoSection fileType="Video" filePath={videoPath} setFilePath={setVideoPath} />
        <MyButton
          type="submit"
          label={cliOutput.length > 0 ? 'Stop Rendering' : 'Start Rendering'}
        />
        {percentage && <Progressbar progress={percentage} />}
        {remainingTime && (
          <div className="text-white">
            {remainingTime.toLowerCase().includes('nan')
              ? 'Calculating remaining time ...'
              : remainingTime}
          </div>
        )}
      </div>
    </form>
  )
}
