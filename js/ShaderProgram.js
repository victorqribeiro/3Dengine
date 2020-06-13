class ShaderProgram {

    constructor(vsSrc, fsSrc){
        this.vsSrc = vsSrc
        this.fsSrc = fsSrc
    }

    async init(){
        this.vertexShader = await this.constructor.loadShader(gl.VERTEX_SHADER, this.vsSrc)
        this.fragmentShader = await this.constructor.loadShader(gl.FRAGMENT_SHADER, this.fsSrc)
        this.shaderProgram = gl.createProgram()
        gl.attachShader(this.shaderProgram, this.vertexShader)
        gl.attachShader(this.shaderProgram, this.fragmentShader)
        this.bindAttributes()
        gl.linkProgram(this.shaderProgram)
        this.getAllUniformLocations()
    }

    getUniformLocation(uniformName){
        return gl.getUniformLocation(this.shaderProgram, uniformName)
    }

    bindAttribute(attribute, variableName){
        gl.bindAttribLocation(this.shaderProgram, attribute, variableName)
    }

    start(){
        gl.useProgram(this.shaderProgram)
        const resolution = gl.getUniformLocation(this.shaderProgram, 'iResolution')
        gl.uniform3f(resolution, w, h, 0.0)
        const mouse = gl.getUniformLocation(this.shaderProgram, 'iMouse')
        gl.uniform2f(mouse, mousePos.x, mousePos.y)
    }

    stop(){
        gl.useProgram(null)
    }

    static async loadShader(type, src){
        const request = await fetch(`js/shaders/${src}`,{'method': 'GET', headers: {'cache-control': 'no-cache'}})
        const data = await request.text()
        const shader = gl.createShader(type)
        gl.shaderSource(shader, data)
        gl.compileShader(shader)
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader))
			gl.deleteShader(shader)
			return null
		}
        return shader
    }

}
