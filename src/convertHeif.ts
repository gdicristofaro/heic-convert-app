import FileSaver from "file-saver";
import heic2any from "heic2any";
import JSZip from "jszip";


export const convert = async (files: File[]) => {
 
    const zip = new JSZip();
    const usedNames = new Set<string>();

    // for each file, convert to a series of jpgs,
    for (let origFile of files) {
        try {
            let retData = await heic2any({
                blob: origFile,
                toType: "image/png",
                multiple: true,
            })

            let jpgArr : Blob[] = getBlobArr(retData);
            for (let jpgIdx = 0; jpgIdx < jpgArr.length; jpgIdx++) {
                let jpg = jpgArr[jpgIdx];
                let fileName: string = getUniquePath(origFile, usedNames, jpgIdx);
                usedNames.add(fileName);
                zip.file(fileName, jpg);
            }
        } catch (ex) {
            console.warn("Unable to process file: ", origFile, ex);
            console.info(origFile, ex);
        }
    }

    // zip and download 
    return await zip.generateAsync({ type: 'blob' });
}

function getUniquePath(origFile: File, usedNames: Set<string>, jpgIdx: number): string {
    let fileName = getFileNameWithoutExt(origFile);
    let nth = 0;
    let fileId = getFileId(fileName, jpgIdx, nth);
    while (usedNames.has(fileId)) {
        fileId = getFileId(fileName, jpgIdx, ++nth);
    }
    return fileId;
}

function padNum(num: number, places: number): string {
    let numStr = num.toString();
    while (numStr.length < places) {
        numStr = "0" + numStr;
    }
    return numStr;
}

const PAD_SIZE = 3;
const EXTENSION = ".jpg";

function getFileId(baseFileName: string, jpgIdx: number, nth: number = 0) {
    let jpgIdxStr = jpgIdx > 0 ? `_part${padNum(jpgIdx, PAD_SIZE)}` : "";
    let nthStr = nth > 0 ? `_${padNum(nth, PAD_SIZE)}` : "";
    return `${baseFileName}${nthStr}${jpgIdxStr}${EXTENSION}`;
}

function getFileNameWithoutExt(origFile: File): string {
    let fullFileName = origFile.name;
    let lastperiod = fullFileName.lastIndexOf(".");
    return lastperiod > 0 ? fullFileName.substring(0, lastperiod) : fullFileName;
}

function getBlobArr(retData: Blob | Blob[]): Blob[] {
    if (retData instanceof Blob) {
        return [retData];
    } else {
        return retData;
    }
}

export const convertAndDownload = async (files: File[]) => {
    let zipToDownload = await convert(files);
    FileSaver.saveAs(zipToDownload, getZipDownloadName());
}


function getZipDownloadName(): string {
    return "heif_convert.zip";
}

