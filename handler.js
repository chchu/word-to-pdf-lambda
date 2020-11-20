'use strict';

const fs = require('fs')
const {convertTo, canBeConvertedToPDF} = require('@shelf/aws-lambda-libreoffice')

module.exports.convert = async (event, context) => {
    const ret = {
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin" : "*"},
    }

    const fileName = context.awsRequestId + '.docx'
    const filePath = '/tmp/' + fileName
    const buffer = Buffer.from(event.body, 'base64')
    // TMPファイルにアップロードされた docx ファイルを書き込み.
    fs.writeFileSync(filePath, buffer);
    if (canBeConvertedToPDF(fileName)) {
        // libreoffice で変換.
        const pdfFilePath = await convertTo(fileName, 'pdf')
        const pdfBuffer = fs.readFileSync(pdfFilePath)
        // レスポンスでPDFデータを返却(BASE64)
        ret['body'] = pdfBuffer.toString('base64')
    } else {
        ret['body'] = 'not convert'
    }
    return ret
}
