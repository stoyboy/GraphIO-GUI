import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from 'react'

interface IFileType {
  selectedFile: File | null,
  selectedFileName: string | null | undefined
}

interface ICalculateResponse {
  adjacencyMatrix: string[][],
  distanceMatrix: string[][],
  pathMatrix: string[][],
  eccentricity: string,
  radius: string,
  diameter: string,
  center: string,
  components: string[],
  articulation: string,
  bridges: string[]
}

const Home: NextPage = () => {
  const [file, setFile] = useState<IFileType>({
    selectedFile: null,
    selectedFileName: undefined
  });

  const [calculateResponse, setCalculateResponse] = useState<ICalculateResponse>({
    adjacencyMatrix: [],
    distanceMatrix: [],
    pathMatrix: [],
    eccentricity: "",
    radius: "",
    diameter: "",
    center: "",
    components: [],
    articulation: "",
    bridges: []
  })

  const calculate = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file.selectedFile!)
      const response = await axios.post("http://localhost:8080/calculate", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      setCalculateResponse({
        adjacencyMatrix: response.data.adjacencyMatrix,
        distanceMatrix: response.data.distanceMatrix,
        pathMatrix: response.data.pathMatrix,
        eccentricity: response.data.eccentricity,
        radius: response.data.radius,
        diameter: response.data.diameter,
        center: response.data.center,
        components: response.data.components,
        articulation: response.data.articulation,
        bridges: response.data.bridges
      })
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='w-fit min-w-full min-h-screen h-full p-12 bg-gradient-to-r from-cyan-500 to-blue-500'>
      <Head>
        <title>GraphIO</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex gap-8 justify-start'>
        <div>
          <span className='inline-flex justify-center bg-black bg-opacity-20 rounded-md px-6 py-4 text-3xl font-medium text-white mb-4'>
            GraphIO
          </span>
          <div className='grid grid-cols-2 gap-4 w-72'>
            <label className="inline-flex justify-center items-center bg-black bg-opacity-20 rounded-md px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-opacity-30" htmlFor="file_input">Upload file</label>
            <input className="hidden w-full text-sm text-white"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={(e) => {
                setFile({
                  selectedFile: e.target.files![0],
                  selectedFileName: e.target.files?.item(0)?.name
                })
              }}
              accept="text/csv" />
            <span className='inline-flex items-center text-white'>{file.selectedFileName}</span>
            <div className='flex flex-row rounded-md col-span-2'>
              <button className={`w-full inline-flex justify-center items-center bg-black bg-opacity-20 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 ${file.selectedFile == null ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={file.selectedFile == null}
                type="submit"
                onClick={() => calculate()}
              >
                Calculate
              </button>
            </div>
            <div className="flex flex-col col-span-2 gap-y-4 mt-12 break-words">
              {calculateResponse.eccentricity != "" && (
                <div className='flex flex-col gap-y-2'>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-min text-sm font-medium text-white'>Exzentrizität</span>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-full text-sm font-medium text-white'>{calculateResponse.eccentricity}</span>
                </div>
              )}
              {calculateResponse.radius != "" && (
                <div className='flex flex-col gap-y-2'>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-min text-sm font-medium text-white'>Radius</span>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-full text-sm font-medium text-white'>{calculateResponse.radius}</span>
                </div>
              )}
              {calculateResponse.diameter != "" && (
                <div className='flex flex-col gap-y-2'>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-min text-sm font-medium text-white'>Durchmesser</span>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-full text-sm font-medium text-white'>{calculateResponse.diameter}</span>
                </div>
              )}
              {calculateResponse.center != "" && (
                <div className='flex flex-col gap-y-2'>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-min text-sm font-medium text-white'>Zentrum</span>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-full text-sm font-medium text-white'>{calculateResponse.center}</span>
                </div>
              )}
              {calculateResponse.components.length != 0 && (
                <div className='flex flex-col gap-y-2'>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-min text-sm font-medium text-white'>Komponenten</span>
                  <div className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-full text-sm font-medium text-white'>{
                    calculateResponse.components.map((value: string, index: number) => {
                      return (
                        <>
                          <span key={index}>{value}</span>
                          <br />
                        </>
                      )
                    })
                  }</div>
                </div>
              )}
              {calculateResponse.components.length != 0 && (
                <div className='flex flex-col gap-y-2'>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-min text-sm font-medium text-white'>Artikulationen</span>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-full text-sm font-medium text-white'>{calculateResponse.articulation == "" ? "\u2800" : calculateResponse.articulation}</span>
                </div>
              )}
              {calculateResponse.bridges.length != 0 && (
                <div className='flex flex-col gap-y-2'>
                  <span className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-min text-sm font-medium text-white'>Brücken</span>
                  <div className='bg-black bg-opacity-20 rounded-md px-4 py-2 w-full text-sm font-medium text-white'>{
                    calculateResponse.bridges.map((value: string, index: number) => {
                      return (
                        <>
                          <span key={index}>{value}</span>
                          <br />
                        </>
                      )
                    })
                  }</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {calculateResponse.adjacencyMatrix.length != 0 &&
          <div className='flex flex-col gap-4'>
            <span className='inline-flex justify-center bg-black bg-opacity-20 rounded-md p-4 text-xl font-medium text-white'>Adjazenzmatrix</span>
            <table className='bg-black bg-opacity-20 rounded-md font-medium text-sm text-white'>
              {calculateResponse.adjacencyMatrix.map((items, index) => {
                return (
                  <tr key={index}>
                    {items.map((subItems, sIndex) => {
                      return <td key={sIndex} className='text-center p-2'>{subItems}</td>;
                    })}
                  </tr>
                )
              })}
            </table>
          </div>
        }
        {calculateResponse.distanceMatrix.length != 0 &&
          <div className='flex flex-col gap-4'>
            <span className='inline-flex justify-center bg-black bg-opacity-20 rounded-md p-4 text-xl font-medium text-white'>Distanzmatrix</span>
            <table className='bg-black bg-opacity-20 rounded-md font-medium text-sm text-white'>
              {calculateResponse.distanceMatrix.map((items, index) => {
                return (
                  <tr key={index}>
                    {items.map((subItems, sIndex) => {
                      return <td key={sIndex} className='text-center p-2'>{subItems == null ? "\u221e" : subItems}</td>;
                    })}
                  </tr>
                )
              })}
            </table>
          </div>
        }
        {calculateResponse.pathMatrix.length != 0 &&
          <div className='flex flex-col gap-4'>
            <span className='inline-flex justify-center bg-black bg-opacity-20 rounded-md p-4 text-xl font-medium text-white'>Wegmatrix</span>
            <table className='bg-black bg-opacity-20 rounded-md font-medium text-sm text-white'>
              {calculateResponse.pathMatrix.map((items, index) => {
                return (
                  <tr key={index}>
                    {items.map((subItems, sIndex) => {
                      return <td key={sIndex} className='text-center p-2'>{subItems}</td>;
                    })}
                  </tr>
                )
              })}
            </table>
          </div>
        }
      </main>
    </div>
  )
}

export default Home
