// export interface DriveDataInterface {
//   available: number;
//   mountpoint: string;
//   name: string;
//   percentageUsed: number;
//   total: number;
//   used: number;
// }
export interface DriveDataInterface {
  fs: string;
  type: string;
  size: number;
  used: number;
  available: number;
  use: number;
  mount: string;
  rw: boolean;
}

export interface SingleDriveData {
  name: string;
  parentPath: string;
  isDirectory: boolean;
  isFile: boolean;
}
