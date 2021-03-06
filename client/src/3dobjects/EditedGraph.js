/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function EditedGraph(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/editedGraph.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Mesh_0.geometry} material={materials.Default} scale={0.1} />
      <mesh geometry={nodes.Mesh_1.geometry} material={nodes.Mesh_1.material} scale={0.1} />
      <mesh geometry={nodes.Mesh_2.geometry} material={nodes.Mesh_2.material} scale={0.1} />
      <mesh geometry={nodes.Mesh_3.geometry} material={nodes.Mesh_3.material} scale={0.1} />
      <mesh geometry={nodes.Mesh_4.geometry} material={nodes.Mesh_4.material} scale={0.1} />
      <mesh geometry={nodes.Mesh_5.geometry} material={nodes.Mesh_5.material} scale={0.1} />
      <mesh geometry={nodes.Mesh_6.geometry} material={nodes.Mesh_6.material} scale={0.1} />
    </group>
  )
}

useGLTF.preload('/editedGraph.glb')
