export interface IIntake {
    id: number;
    orientation: string;  // TypeScript uses string for Date
    startdate: string;    // TypeScript uses string for Date
    enddate: string;      // TypeScript uses string for Date
    duration: number;
    code: string | null;  // Nullable string
    groupid: number;
}