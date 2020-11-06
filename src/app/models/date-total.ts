export namespace DateTotal {

  export interface SerieNameResponseData {
    from: string | number
    to: string | number
  }

  export interface SerieResponseData {
    dataName: SerieNameResponseData
    name: string
    value: number
  }
  export interface HistogramResponse {
    name: string
    series: SerieResponseData[]
  }

}
