class SkyboxRenderer {

    constructor(cubeMapTexture, skyBoxShader, projectionMatrix, fogColor){
        this.SIZE = 500
        this.vertices = [
            -this.SIZE,  this.SIZE, -this.SIZE,
            -this.SIZE, -this.SIZE, -this.SIZE,
             this.SIZE, -this.SIZE, -this.SIZE,
             this.SIZE, -this.SIZE, -this.SIZE,
             this.SIZE,  this.SIZE, -this.SIZE,
            -this.SIZE,  this.SIZE, -this.SIZE,

            -this.SIZE, -this.SIZE,  this.SIZE,
            -this.SIZE, -this.SIZE, -this.SIZE,
            -this.SIZE,  this.SIZE, -this.SIZE,
            -this.SIZE,  this.SIZE, -this.SIZE,
            -this.SIZE,  this.SIZE,  this.SIZE,
            -this.SIZE, -this.SIZE,  this.SIZE,

             this.SIZE, -this.SIZE, -this.SIZE,
             this.SIZE, -this.SIZE,  this.SIZE,
             this.SIZE,  this.SIZE,  this.SIZE,
             this.SIZE,  this.SIZE,  this.SIZE,
             this.SIZE,  this.SIZE, -this.SIZE,
             this.SIZE, -this.SIZE, -this.SIZE,

            -this.SIZE, -this.SIZE,  this.SIZE,
            -this.SIZE,  this.SIZE,  this.SIZE,
             this.SIZE,  this.SIZE,  this.SIZE,
             this.SIZE,  this.SIZE,  this.SIZE,
             this.SIZE, -this.SIZE,  this.SIZE,
            -this.SIZE, -this.SIZE,  this.SIZE,

            -this.SIZE,  this.SIZE, -this.SIZE,
             this.SIZE,  this.SIZE, -this.SIZE,
             this.SIZE,  this.SIZE,  this.SIZE,
             this.SIZE,  this.SIZE,  this.SIZE,
            -this.SIZE,  this.SIZE,  this.SIZE,
            -this.SIZE,  this.SIZE, -this.SIZE,

            -this.SIZE, -this.SIZE, -this.SIZE,
            -this.SIZE, -this.SIZE,  this.SIZE,
             this.SIZE, -this.SIZE, -this.SIZE,
             this.SIZE, -this.SIZE, -this.SIZE,
            -this.SIZE, -this.SIZE,  this.SIZE,
             this.SIZE, -this.SIZE,  this.SIZE
        ]
        this.cube = loader.loadToVAOsimple(this.vertices, 3)
        this.texture = cubeMapTexture
        this.shader = skyBoxShader
        this.fogColor = fogColor
        this.shader.start()
        this.shader.loadProjectionMatrix(projectionMatrix)
        this.shader.loadFogColor(this.fogColor)
        this.shader.stop()
    }

    render(camera){
        this.shader.start()
        this.shader.loadViewMatrix(camera)
        this.shader.loadFogColor(this.fogColor)
        gl.bindVertexArray(this.cube.vaoID)
        gl.enableVertexAttribArray(0)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture)
        gl.drawArrays(gl.TRIANGLES, 0, this.cube.vertexCount)
        gl.disableVertexAttribArray(0)
        gl.bindVertexArray(null)
        this.shader.stop()
    }

}
