class TerrainRenderer {

  constructor(shader, projectionMatrix){
    this.terrainShader = shader
    this.projectionMatrix = projectionMatrix
    this.terrainShader.start()
    this.terrainShader.loadProjectionMatrix(this.projectionMatrix)
    this.terrainShader.connectTextureUnits()
    this.terrainShader.stop()
  }

  render(terrains){
    for(const terrain of terrains){
      this.prepareTerrain(terrain)
      this.loadModelMatrix(terrain)
      gl.drawElements(gl.TRIANGLES, terrain.rawModel.vertexCount, gl.UNSIGNED_INT, 0)
      this.unbindTexturedModel()
    }
  }

  prepareTerrain(terrain){
    gl.bindVertexArray(terrain.rawModel.vaoID)
    gl.enableVertexAttribArray(0)
    gl.enableVertexAttribArray(1)
    gl.enableVertexAttribArray(2)
    this.terrainShader.loadShineVariables(1, 0)
    this.bindTextures(terrain)
  }

  bindTextures(terrain){
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, terrain.texturePack.backgroundTexture.textureID)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, terrain.texturePack.rTexture.textureID)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, terrain.texturePack.gTexture.textureID)
    gl.activeTexture(gl.TEXTURE3)
    gl.bindTexture(gl.TEXTURE_2D, terrain.texturePack.bTexture.textureID)
    gl.activeTexture(gl.TEXTURE4)
    gl.bindTexture(gl.TEXTURE_2D, terrain.blendMap.textureID)
  }

  unbindTexturedModel(){
    gl.disableVertexAttribArray(0)
    gl.disableVertexAttribArray(1)
    gl.disableVertexAttribArray(2)
    gl.bindVertexArray(null)
  }

  loadModelMatrix(terrain){
    const transformationMatrix = Maths.createTransformMatrix(
      {'x': terrain.x, 'y': 0, 'z': terrain.z},
      {'x': 0, 'y': 0, 'z': 0},
      {'x': 1, 'y': 1, 'z': 1}
    )
    this.terrainShader.loadTransformationMatrix(transformationMatrix)
  }

}
