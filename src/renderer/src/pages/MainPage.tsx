import JsonSection from '@renderer/components/JsonSection'
import MyButton from '@renderer/components/MyButton'
import Progressbar from '@renderer/components/Progressbar'
import { Scoreboard } from '@renderer/components/Scoreboard'
import TeamsSection from '@renderer/components/TeamsSection'
import VideoSection from '@renderer/components/VideoSection'
import { TeamsData } from '@renderer/types/teamsForm'
import { useCallback, useEffect, useRef, useState } from 'react'

const NUMBER_OF_RECORDS = 20

export function MainPage() {
  const [scoresPath, setScoresPath] = useState<string | undefined>(undefined)
  const [scoresContent, setScoresContent] = useState<string | undefined>(undefined)
  const [videoPath, setVideoPath] = useState<string | undefined>(undefined)
  const [cliOutput, setCliOutput] = useState<string[]>([])
  const [percentage, setPercentage] = useState<number | undefined>(undefined)
  const [remainingTime, setRemainingTime] = useState<string | undefined>(undefined)
  const [homeColor, setHomeColor] = useState<string | undefined>('#00ff00')
  const [awayColor, setAwayColor] = useState<string | undefined>('#ff0000')
  const [homeName, setHomeName] = useState<string | undefined>('T-H')
  const [awayName, setAwayName] = useState<string | undefined>('T-A')
  const [outputName, setOutputName] = useState<string | undefined>('Scoreboard')

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
      await ipcRenderer.invoke('run-docker-container', outputName)
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
        console.log({ result })
        if ((result.output as string).includes('Stitched')) {
          setTimeout(() => {
            stopContainer()
          }, 10000)
        } else {
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

  const onSubmit = () => {
    if (cliOutput.length > 0) {
      stopContainer()
    } else {
      console.log({ homeName, awayName, homeColor, awayColor })
      writeJsonFile({
        teamHomeName: homeName,
        teamAwayName: awayName,
        teamHomeColor: homeColor,
        teamAwayColor: awayColor
      })
      startContainer()
    }
    return
  }

  return (
    <div className="flex flex-col w-screen h-screen p-3 bg-slate-950 overflow-hidden text-xl font-semibold">
      <div className="flex flex-col size-full gap-5 overflow-hidden">
        <h1 className="text-3xl text-white">Scoreboard Renderer</h1>

        <div className="flex items-center w-full gap-4 overflow-hidden">
          <div className="w-1/2">
            <TeamsSection
              awayColor={awayColor}
              homeColor={homeColor}
              setAwayColor={setAwayColor}
              setHomeColor={setHomeColor}
              awayName={awayName}
              homeName={homeName}
              setAwayName={setAwayName}
              setHomeName={setHomeName}
              outputName={outputName}
              setOutputName={setOutputName}
            />
          </div>
          <div className="flex w-1/2 justify-center">
            <Scoreboard
              teamAwayColor={awayColor}
              teamAwayName={awayName}
              teamHomeColor={homeColor}
              teamHomeName={homeName}
            />
          </div>
        </div>

        <JsonSection
          fileType="Scores"
          filePath={scoresPath}
          fileContent={scoresContent}
          setFilePath={setScoresPath}
          setFileContent={setScoresContent}
        />
        <VideoSection fileType="Video" filePath={videoPath} setFilePath={setVideoPath} />
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <Progressbar progress={percentage ? `${percentage}%` : 'Rendering is not running'} />
        <div className="flex text-white">
          <div className="text-slate-100 w-40">Remaining time:</div>
          {remainingTime && cliOutput.length > 0
            ? remainingTime.toLowerCase().includes('nan')
              ? 'Calculating remaining time ...'
              : remainingTime
            : 'Rendering is not running'}
        </div>
      </div>
      <MyButton
        type="submit"
        label={cliOutput.length > 0 ? 'Stop Rendering' : 'Start Rendering'}
        onClick={onSubmit}
      />
    </div>
  )
}
