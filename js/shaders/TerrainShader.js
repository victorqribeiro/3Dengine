class TerrainShader extends ShaderProgram {

    constructor(){
        super('terrain.vs', 'terrain.fs')
    }

    bindAttributes(){
        super.bindAttribute(0, "position")
        super.bindAttribute(1, "textureCoords")
        super.bindAttribute(2, "normal")
    }

    getAllUniformLocations(){
        this.location_transformationMatrix = super.getUniformLocation("transformationMatrix")
        this.location_projectionMatrix = super.getUniformLocation("projectionMatrix")
        this.location_viewMatrix = super.getUniformLocation("viewMatrix")
        this.location_lightPosition = super.getUniformLocation("lightPosition")
        this.location_lightColor = super.getUniformLocation("lightColor")
        this.location_shineDamper = super.getUniformLocation("shineDamper")
        this.location_reflectivity = super.getUniformLocation("reflectivity")
        this.location_skyColor = super.getUniformLocation("skyColor")
        this.location_backgroundTexture = super.getUniformLocation("backgroundTexture")
        this.location_rTexture = super.getUniformLocation("rTexture")
        this.location_gTexture = super.getUniformLocation("gTexture")
        this.location_bTexture = super.getUniformLocation("bTexture")
        this.location_blendMap = super.getUniformLocation("blendMap")
    }

    connectTextureUnits(){
        gl.uniform1i(this.location_backgroundTexture, 0)
        gl.uniform1i(this.location_rTexture, 1)
        gl.uniform1i(this.location_gTexture, 2)
        gl.uniform1i(this.location_bTexture, 3)
        gl.uniform1i(this.location_blendMap, 4)
    }

    loadSkyColor(skyColor){
        gl.uniform3fv(this.location_skyColor, Object.values(skyColor))
    }

    loadShineVariables(shineDamper, reflectivity){
        gl.uniform1f(this.location_shineDamper, shineDamper)
        gl.uniform1f(this.location_reflectivity, reflectivity)
    }

    loadLight(ligth){
        gl.uniform3fv(this.location_lightPosition, Object.values(light.position))
        gl.uniform3fv(this.location_lightColor, Object.values(light.color))
    }

    loadTransformationMatrix(matrix){
        gl.uniformMatrix4fv(this.location_transformationMatrix, false, matrix)
    }

    loadViewMatrix(camera){
        const matrix = Maths.createViewMatrix(camera)
        gl.uniformMatrix4fv(this.location_viewMatrix, false, matrix)
    }

    loadProjectionMatrix(matrix){
        gl.uniformMatrix4fv(this.location_projectionMatrix, false, matrix)
    }
}
