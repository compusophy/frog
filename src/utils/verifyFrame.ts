import { bytesToHex, bytesToString, hexToBytes } from 'viem'
import { FrameActionBody, Message } from '../protobufs/generated/message_pb.js'
import { type FrameData, type TrustedData } from '../types/frame.js'
import type { Hub } from '../types/hub.js'
import { parsePath } from './parsePath.js'

export type VerifyFrameParameters = {
  frameUrl: string
  hub: Hub
  trustedData: TrustedData
  url: string
}

export type VerifyFrameReturnType = {
  frameData: FrameData
}

export async function verifyFrame({
  frameUrl,
  hub,
  trustedData,
  url,
}: VerifyFrameParameters): Promise<VerifyFrameReturnType> {
  const body = hexToBytes(`0x${trustedData.messageBytes}`)
  const response = await fetch(`${hub.apiUrl}/v1/validateMessage`, {
    ...hub.fetchOptions,
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      ...hub.fetchOptions?.headers,
    },
    body,
  }).then((res) => res.json())

  if (!response.valid)
    throw new Error(`message is invalid. ${response.details}`)

  if (!parsePath(url)?.startsWith(parsePath(frameUrl)))
    throw new Error(`Invalid frame url: ${frameUrl}. Expected: ${url}.`)

  const message = Message.fromBinary(body)
  const frameData = messageToFrameData(message)
  return { frameData }
}

////////////////////////////////////////////////////////////////////
// Utilties

export function messageToFrameData(message: Message): FrameData {
  const frameActionBody = message.data?.body.value as FrameActionBody
  const frameData: FrameData = {
    castId: {
      fid: Number(frameActionBody.castId?.fid),
      hash: bytesToHex(frameActionBody.castId?.hash!),
    },
    fid: Number(message.data?.fid!),
    messageHash: bytesToHex(message.hash),
    network: message.data?.network!,
    timestamp: message.data?.timestamp!,
    url: bytesToString(frameActionBody.url),
    buttonIndex: frameActionBody.buttonIndex as any,
    inputText: bytesToString(frameActionBody.inputText),
    state: bytesToString(frameActionBody.state),
  }

  return frameData
}
