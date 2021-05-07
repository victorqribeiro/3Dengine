class LinesRenderer {

    constructor(shader, projectionMatrix){
      this.shader = shader
      this.projectionMatrix = projectionMatrix
    }

    render(entities){
        for(const entity of entities){
            gl.bindVertexArray(entity.texturedModel.vaoID)
            gl.enableVertexAttribArray(0)
            this.prepareInstance(entity)
            gl.drawArrays(gl.LINES, 0, entity.texturedModel.vertexCount)
            gl.disableVertexAttribArray(0)
            gl.bindVertexArray(null)
        }
    }

    prepareInstance(entity){
      const transformationMatrix = Maths.createTransformMatrix(entity.position, entity.rotation, entity.scale)
      this.shader.loadTransformationMatrix(transformationMatrix)
    }

}
