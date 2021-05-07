class LinesShader extends ShaderProgram {

    constructor(){
        super('lines.vs', 'lines.fs')
    }

    bindAttributes(){
        super.bindAttribute(0, "position")
    }

    getAllUniformLocations(){
        this.location_transformationMatrix = super.getUniformLocation("transformationMatrix")
        this.location_projectionMatrix = super.getUniformLocation("projectionMatrix")
        this.location_viewMatrix = super.getUniformLocation("viewMatrix")
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
