import React, { useState } from "react"

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
import { PublicNonces } from "aams-test/dist/types/nonce"
import { Key } from "aams-test/dist/types/key"
import { useMultiSigTx } from "../../aa/useMultiSigTx.tsx"

export const CreateSignature: React.FC<MultiOwnersSmartAccountParams> = (accountParams) => {
  const { chainId } = accountParams
  const [msg, setMsg] = useState<string>("0xeaa808107c9907b99669254413d6144aa187887196ee07614d3590d4277b8017")
  const [sigData, setSigData] = useState<string>("")
  const [msgHash, setMsgHash] = useState<string>("")
  const [signatures, setSignatures] = useState<SignatureOutput[]>([])
  const [summedMuSig, setMuSig] = useState<Signature>()
  const { multiOwnerSmartAccount } = useMultiOwnerSmartAccount(accountParams)
  const [isValidSig, setIsValidSig] = useState<boolean>()

  const [pubKeys, setPubKeys] = useState<Key[]>([])
  const [nonces, setNonces] = useState<PublicNonces[]>([])
  const [combinedPubKey, setCombinedPubKey] = useState<Key>()

  const schnorrSigners = useSchnorrSigners({ chainId })
  const muSigTx = useMultiSigTx({ signers: schnorrSigners, opHash: msgHash as Hex })

  const handlePkNonces = () => {
    const pk = schnorrSigners.flatMap((sig) => sig.getPublicKey())
    const pn = schnorrSigners.flatMap((sig) => sig.getPublicNonces())
    const cpk = Schnorrkel.getCombinedPublicKey(pk)
    setPubKeys(pk)
    setNonces(pn)
    setCombinedPubKey(cpk)
    console.log("cpk===>", { schnorrSigners })
    console.log("cpk===>", { pk }, { pn }, { cpk })
  }

  // const handleMultiSign = async (signer: SchnorrSigner) => {
  //   if (msg && pubKeys && nonces) {
  //     const _sig = signer.multiSignMessage(msg, pubKeys, nonces)
  //     setSignatures([...signatures, _sig])
  //     console.log("[verify] SIGNED!")
  //   }
  // }

  const handleSingleSign = async (signer: SchnorrSigner) => {
    console.log("[musigtx] handle single sign ====>>>>", signer.getAddress(), { signer })
    console.log("[musigtx] handle musig tx ====>>>>", muSigTx)
    if (msg && muSigTx && signer) {
      muSigTx.setMsg(msg)
      // const _sig = signer.multiSignMessage(msg, pubKeys, nonces)
      const _sig = muSigTx.singleSignMessage(signer)
      // muSigTx.setSingleSign(signer, _sig)
      console.log("[musigtx] handle sign sig ====>>>>", _sig)
    }
  }

  // const handleSummedSign = () => {
  //   if (signatures && combinedPubKey) {
  //     const _sigs = signatures.flatMap((sig) => sig.signature)
  //     // const _sigs = [signatures[0].signature, signatures[1].signature]
  //     console.log("[verify]", { sumMultiSchnorrSigs })
  //     const _summed = sumMultiSchnorrSigs(_sigs)
  //     setMuSig(_summed)
  //     console.log("[verify] SIGNED SUMMED! summed sig ====>>>>", _summed.toHex())

  //     // the multisig px and parity
  //     // const combinedPublicKey = Schnorrkel.getCombinedPublicKey(pubKeys)
  //     const px = ethers.utils.hexlify(combinedPubKey.buffer.subarray(1, 33))
  //     const parity = combinedPubKey.buffer[0] - 2 + 27
  //     const e = signatures[0].challenge

  //     // wrap the result
  //     const abiCoder = new ethers.utils.AbiCoder()
  //     const sigData = abiCoder.encode(
  //       ["bytes32", "bytes32", "bytes32", "uint8"],
  //       [px, e.buffer, _summed.buffer, parity]
  //     )

  //     setSigData(sigData)
  //     return { sigData, msgHash }
  //   }
  // }

  const handleGenerateCombinedSigDataAndHash = async () => {
    console.log("[musigtx] getSigData tx ====>>>>", { muSigTx })
    if (signatures && muSigTx) {
      const sigData = muSigTx.getMultiSign()
      if (sigData) setSigData(sigData)
      console.log("[musigtx] getSigData sig ====>>>>", sigData)
    }
  }

  const handleVerifySignature = async () => {
    console.log("[verify] verify signature acc", { multiOwnerSmartAccount })
    console.log("[verify] verify signature data", sigData)
    console.log("[verify] verify signature hash", msgHash)
    if (msgHash && sigData && multiOwnerSmartAccount) {
      const result = await multiOwnerSmartAccount.isValidSignature(msgHash, sigData)
      console.log("[verify] verify signature result", result)
      setIsValidSig(result == ERC1271_MAGICVALUE_BYTES32)
    }
  }
  const clearData = () => {
    setSigData("")
    setMsgHash("")
    setSignatures([])
    setMuSig(undefined)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>Type message to be signed:</b>
      <input
        type="text"
        value={msg}
        onChange={(e) => {
          setMsg(String(e.target.value))
          const _msgHash = ethers.utils.solidityKeccak256(["string"], [String(e.target.value)])
          setMsgHash(_msgHash)
        }}
      />
      <button onClick={handlePkNonces}>Generate pub keys and nonces</button>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {schnorrSigners.map((signer) => {
          return schnorrSigners.length > 0 ? (
            <button onClick={() => handleSingleSign(signer)}>SIGN with account {signer.getAddress()}</button>
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
      {/* <button onClick={handleGenerateCombinedSigDataAndHash}>Generate summed signature</button> */}
      <text>Msg hash: {msgHash}</text>
      {/* <text>
        Pub keys: {pubKeys ? pubKeys[0]?.toHex() : ""} {pubKeys ? pubKeys[1]?.toHex() : ""}
      </text>
      <text>
        P nonces: {nonces ? nonces[0]?.kPublic?.toHex() : ""} {nonces ? nonces[1]?.kPublic?.toHex() : ""}
      </text> */}
      <text>Sig data: {sigData}</text>
      <text>SummedSi: {summedMuSig?.toHex() as Hex}</text>
      <button onClick={handleGenerateCombinedSigDataAndHash}>Handle Summed Sig</button>

      <button onClick={handleVerifySignature}>Verify Signature</button>
      <h4 style={{ color: isValidSig ? "green" : "red" }}>Is Valid? {isValidSig ? "yes" : "no"}</h4>
      <button onClick={clearData}>Clear data</button>
    </div>
  )
}
