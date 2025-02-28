class MasterRenderer {

  constructor(shader, linesShader, terrainShader, skyColor, skyboxTexture, skyboxShader){
    this.shader = shader
    this.linesShader = linesShader
    this.terrainShader = terrainShader
    this.entities = {}
    this.FOV = 70
    this.NEAR_PLANE = 0.1
    this.FAR_PLANE = 1000
    this.skyColor = skyColor
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    this.updateProjection()
    this.entityRenderer = new EntityRenderer(this.shader, this.projectionMatrix)
    this.linesRenderer = new LinesRenderer(this.linesShader, this.projectionMatrix)
    this.terrainRenderer = new TerrainRenderer(this.terrainShader, this.projectionMatrix)
    this.skyboxRenderer = new SkyboxRenderer(skyboxTexture, skyboxShader, this.projectionMatrix, this.skyColor)
    this.lines = []
    this.terrains = []
  }

  render(light, camera){
    this.prepare()
    this.shader.start()
    this.shader.loadSkyColor(this.skyColor)
    this.shader.loadLight(light)
    this.shader.loadViewMatrix(camera)
    this.entityRenderer.render(this.entities)
    this.shader.stop()

    this.linesShader.start()
    this.linesShader.loadViewMatrix(camera)
    this.linesRenderer.render(this.lines)
    this.linesShader.stop()

    this.terrainShader.start()
    this.terrainShader.loadSkyColor(this.skyColor)
    this.terrainShader.loadLight(light)
    this.terrainShader.loadViewMatrix(camera)
    this.terrainRenderer.render(this.terrains)
    this.terrainShader.stop()

    this.skyboxRenderer.render(camera)

    //this.terrains = []
    this.entities = {}
  }

  static enableCulling(){
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)  
  }
  
  static disableCulling(){
    gl.disable(gl.CULL_FACE)
  }

  processLines(linesObject){
    this.lines.push(linesObject) 
  }

  processTerrain(terrain){
    this.terrains.push(terrain)
  }

  processEntity(entity){
    if(entity.hideIfOutOfFOV){
        const a = {z: entity.position.z - camera.position.z, x: entity.position.x - camera.position.x}
        const lenA = Math.sqrt( a.x*a.x + a.z*a.z )
        a.x /= lenA
        a.z /= lenA
        const b = {z: player.position.z - camera.position.z, x: player.position.x - camera.position.x}
        const lenB = Math.sqrt( b.x*b.x + b.z*b.z )
        b.x /= lenB
        b.z /= lenB
        if(a.z * b.z + a.x * b.x <= 0.5)
            return
    }
    const index = entity.texturedModel.modelTexture.id
    if(this.entities[index]){
      this.entities[index].push(entity)
    }else{
      this.entities[index] = [entity]
    }
  }

  prepare(){
      gl.clearColor(this.skyColor.r, this.skyColor.g, this.skyColor.b, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  createProjectionMatrix(){
      const aspectRatio = w / h
      const y_scale = (1 / Math.tan(glMatrix.toRadian(this.FOV/2))) * aspectRatio
      const x_scale = y_scale / aspectRatio
      const frustum_length = this.FAR_PLANE - this.NEAR_PLANE
      this.projectionMatrix = new Float32Array(16)
      this.projectionMatrix[0] = x_scale
      this.projectionMatrix[5] = y_scale
      this.projectionMatrix[10] = -((this.FAR_PLANE+this.NEAR_PLANE)/frustum_length)
      this.projectionMatrix[11] = -1
      this.projectionMatrix[14] = -((2 * this.NEAR_PLANE * this.FAR_PLANE) / frustum_length)
      this.projectionMatrix[15] = 0
  }

  updateProjection(){
      gl.viewport(0,0,w,h)
      this.createProjectionMatrix()
      this.shader.start()
      this.shader.loadProjectionMatrix(this.projectionMatrix)
      this.shader.stop()
      this.linesShader.start()
      this.linesShader.loadProjectionMatrix(this.projectionMatrix)
      this.linesShader.stop()
      if(this.entityRenderer)
        this.entityRenderer = new EntityRenderer(this.shader, this.projectionMatrix)
      if(this.linesRenderer)
        this.linesRenderer = new LinesRenderer(this.linesShader, this.projectionMatrix)
      if(this.terrainRenderer)
        this.terrainRenderer = new TerrainRenderer(this.terrainShader, this.projectionMatrix)
      if(this.skyboxRenderer){
        this.skyboxRenderer = new SkyboxRenderer(this.skyboxRenderer.texture, this.skyboxRenderer.shader, this.projectionMatrix, this.skyColor)
      }
  }

  cleanUp(){
    this.shader.cleanUp()
  }

}
