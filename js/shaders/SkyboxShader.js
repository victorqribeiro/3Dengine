class SkyboxShader extends ShaderProgram {

    constructor(){
        super('skybox.vs', 'skybox.fs')
    }

    bindAttributes(){
        super.bindAttribute(0, "position")
    }

    getAllUniformLocations(){
        this.location_projectionMatrix = super.getUniformLocation("projectionMatrix")
        this.location_viewMatrix = super.getUniformLocation("viewMatrix")
        this.location_fogColor = super.getUniformLocation("fogColor")
    }

    loadFogColor(fogColor){
        gl.uniform3fv(this.location_fogColor, Object.values(fogColor))
    }

    loadViewMatrix(camera){
        const matrix = Maths.createViewMatrix(camera)
        gl.uniformMatrix4fv(this.location_viewMatrix, false, matrix)
    }

    loadProjectionMatrix(matrix){
        gl.uniformMatrix4fv(this.location_projectionMatrix, false, matrix)
    }

}
