class Loader {

    constructor(){
        this.textures = 0
    }

    loadToVAO(position, textureCoords, normals, indices){
        const vaoID = gl.createVertexArray()
        gl.bindVertexArray(vaoID)
        this.bindIndicesBuffer(indices)
        this.storeDataInAttributeList(0, 3, position)
        this.storeDataInAttributeList(1, 2, textureCoords)
        this.storeDataInAttributeList(2, 3, normals)
        gl.bindVertexArray(null)
        return new RawModel(vaoID, indices.length)
    }

    storeDataInAttributeList(attributeNumber, size, data){
        const vboID = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vboID)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
        gl.vertexAttribPointer(
            attributeNumber,
            size,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    bindIndicesBuffer(data){
        const vboID = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboID)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), gl.STATIC_DRAW)
    }

    async loadTexture(imagePath){
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                const texture = gl.createTexture()
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
                if(this.isPowerOf2(img.width) && this.isPowerOf2(img.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D)
                }else{
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
                }
                resolve({'id': ++this.textures, 'texture': texture})
            }
            img.onerror = reject
            img.src = `models/textures/${imagePath}`
        })
    }

    cleanUp(){
        for(let i = 0; i < this.vaos.length; i++)
            gl.deleteVertexArray(this.vaos[i])
        for(let i = 0; i < this.vbos.length; i++)
            gl.deleteBuffer(this.vbos[i])
        for(let i = 0; i < this.textures.length; i++)
            gl.deleteTexture(this.textures[i])
    }

    isPowerOf2(value){
        return (value & (value - 1)) == 0
    }

}
