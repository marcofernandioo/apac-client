export interface ISemester {
    name: string,
    startdate: Date,
    enddate: Date,
    duration: number,
    midsemstart: Date,
    midsemend: Date,
    midsemduration: number,
    bufferstart: Date,
    bufferend: Date,
    buffersemduration: number,
    examstart: Date,
    examend: Date,
    examduration: number,
    intakeid?: number
}