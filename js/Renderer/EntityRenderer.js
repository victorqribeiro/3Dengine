class EntityRenderer {

    constructor(shader, projectionMatrix){
      this.shader = shader
      this.projectionMatrix = projectionMatrix
    }

    render(entities){
      for(const id in entities){
        const model = entities[id][0]
        this.prepareTexturedModels(model)
        for(const entity of entities[id]){
          this.prepareInstance(entity)
          gl.drawElements(gl.TRIANGLES, entity.texturedModel.model.vertexCount, gl.UNSIGNED_INT, 0)
        }
        this.unbindTexturedModel()
      }
    }

    prepareTexturedModels(entity){
      gl.bindVertexArray(entity.texturedModel.model.vaoID)
      gl.enableVertexAttribArray(0)
      gl.enableVertexAttribArray(1)
      gl.enableVertexAttribArray(2)
      if(entity.texturedModel.modelTexture.hasTransparency){
        MasterRenderer.disableCulling()
      }
      this.shader.loadFakeLightVariable(entity.texturedModel.modelTexture.useFakeLight)
      this.shader.loadShineVariables(entity.texturedModel.modelTexture.shineDamper, entity.texturedModel.modelTexture.reflectivity)
      this.shader.loadAffectedByWind(entity.texturedModel.affectedByWind)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, entity.texturedModel.modelTexture.texture)
    }

    unbindTexturedModel(){
      MasterRenderer.enableCulling()
      gl.disableVertexAttribArray(0)
      gl.disableVertexAttribArray(1)
      gl.disableVertexAttribArray(2)
      gl.bindVertexArray(null)
    }

    prepareInstance(entity){
      const transformationMatrix = Maths.createTransformMatrix(entity.position, entity.rotation, entity.scale)
      this.shader.loadTransformationMatrix(transformationMatrix)
    }

}
