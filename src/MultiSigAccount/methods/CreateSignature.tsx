import React, { useCallback, useState } from "react"

import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"

import { _hashMessage } from "aams-test/dist/core/index"
import { useSchnorrSigners } from "../../aa/useSchnorrSigners.tsx"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import { Signature, SignatureOutput } from "aams-test/dist/types/signature"
import { generateCombinedSigDataAndHash, sumMultiSchnorrSigs } from "aams-test/dist/utils/schnorr-helpers"
import { ethers } from "ethers"
import Schnorrkel from "aams-test/dist/schnorrkel"
import { useMultiOwnerSmartAccount } from "../useMultiOwnerSmartAccount.tsx"
import { ERC1271_MAGICVALUE_BYTES32 } from "../../../utils/const.ts"
import { Hex } from "viem"
import { useEOA } from "../../eoa/useEOA.tsx"

export const CreateSignature: React.FC<MultiOwnersSmartAccountParams> = (accountParams) => {
  const { chainId } = accountParams
  const [msg, setMsg] = useState<string>("")
  const [sigData, setSigData] = useState<string>("")
  const [msgHash, setMsgHash] = useState<string>("")
  const [signatures, setSignatures] = useState<SignatureOutput[]>([])
  const [summedMuSig, setMuSig] = useState<Signature>()
  const schnorrSigners = useSchnorrSigners({ chainId })
  const { isAccountCreated, multiOwnerSmartAccount } = useMultiOwnerSmartAccount(accountParams)
  const [isValidSig, setIsValidSig] = useState<boolean>()

  const handleMultiSign = async (signer: SchnorrSigner) => {
    if (msg && signatures.length < schnorrSigners.length) {
      const _msgHash = ethers.utils.solidityKeccak256(["string"], [msg])
      setMsgHash(_msgHash)
      const pubKeys = schnorrSigners.map((sig) => sig.getPublicKey())
      const pubNonces = schnorrSigners.map((sig) => sig.getPublicNonces())
      const _sig = signer.multiSignMessage(_msgHash, pubKeys, pubNonces)
      setSignatures([...signatures, _sig])
      console.log("SIGNED!")
      console.log("SIGNED msg hash =>>>>>>!", _msgHash)
    }
  }

  const handleSummedSign = () => {
    if (signatures) {
      const _sigs: Signature[] = signatures.map((sig) => sig.signature)
      console.log({ sumMultiSchnorrSigs })
      const _summed = sumMultiSchnorrSigs(_sigs)
      setMuSig(_summed)
      console.log("SIGNED! summed sig ====>>>>", _summed)
    }
  }

  const handleGenerateCombinedSigDataAndHash = async () => {
    if (signatures) {
      const _sigs: Signature[] = signatures.map((sig) => sig.signature)
      const { msgHash, sigData } = await generateCombinedSigDataAndHash(schnorrSigners, msg)
      // const _summed = sumMultiSchnorrSigs(_sigs)
      setMsgHash(msgHash)
      setSigData(sigData)
      console.log("SIGNED! msgHash ====>>>>", msgHash)
    }
  }

  const handleVerifySignature = async () => {
    console.log("verify signature", chainId)
    if (multiOwnerSmartAccount) {
      // const pubKeys = schnorrSigners.map((sig) => sig.getPublicKey())
      // const combinedPublicKey = Schnorrkel.getCombinedPublicKey(pubKeys)
      // const px = ethers.utils.hexlify(combinedPublicKey.buffer.slice(1, 33))
      // const parity = combinedPublicKey.buffer[0] - 2 + 27
      // const e = signatures[0].challenge

      // // wrap the result
      // const abiCoder = new ethers.utils.AbiCoder()
      // const sigData = abiCoder.encode(
      //   ["bytes32", "bytes32", "bytes32", "uint8"],
      //   [px, e.buffer, summedMuSig.buffer, parity]
      // )
      const result = await multiOwnerSmartAccount.isValidSignature(msgHash, sigData)
      console.log("verify signature", result)
      setIsValidSig(result == ERC1271_MAGICVALUE_BYTES32)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>Type message to be signed:</b>
      <input type="text" value={msg} onChange={(e) => setMsg(String(e.target.value))} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {schnorrSigners.map((signer) => {
          return schnorrSigners.length > 0 ? (
            <button onClick={() => handleMultiSign(signer)}>SIGN with account {signer.getAddress()}</button>
          ) : (
            <h2>NO SIGNERS</h2>
          )
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {signatures.map((sig) => {
          return <text>Signature: {sig.signature.toHex()}</text>
        })}
      </div>
      <button onClick={handleGenerateCombinedSigDataAndHash}>Generate summed signature</button>
      <text>{summedMuSig?.toHex() as Hex}</text>

      <button onClick={handleVerifySignature}>Verify Signature</button>
      <h4 style={{ color: isValidSig ? "green" : "red" }}>Is Valid? {isValidSig ? "yes" : "no"}</h4>
    </div>
  )
}
