class Terrain {

  constructor(gridX, girdZ, loader, texturePack, blendMap){
    this.size = 800
    this.vertexCount = 128
    this.x = gridX * this.size
    this.z = girdZ * this.size
    this.rawModel = this.generateTerrain(loader)
    this.texturePack = texturePack
    this.blendMap = blendMap
  }

  generateTerrain(loader){
    const count = this.vertexCount * this.vertexCount
    const vertices = Array(count * 3)
    const normals = Array(count * 3)
    const textureCoords = Array(count * 2)
    const indices = Array(6*(this.vertexCount-1)*(this.vertexCount-1))
    let vertexPointer = 0
    for(let i = 0; i < this.vertexCount; i++){
      for(let j = 0; j < this.vertexCount; j++){
        vertices[vertexPointer*3] = j/(this.vertexCount - 1) * this.size
        vertices[vertexPointer*3+1] = 0
        vertices[vertexPointer*3+2] = i/(this.vertexCount - 1) * this.size
        normals[vertexPointer*3] = 0
        normals[vertexPointer*3+1] = 1
        normals[vertexPointer*3+2] = 0
        textureCoords[vertexPointer*2] = j/(this.vertexCount - 1)
        textureCoords[vertexPointer*2+1] = i/(this.vertexCount - 1)
        vertexPointer++
      }
    }
    let pointer = 0
    for(let gz = 0; gz < this.vertexCount-1; gz++){
      for(let gx = 0; gx < this.vertexCount-1; gx++){
        const topLeft = (gz*this.vertexCount) + gx
        const topRight = topLeft + 1
        const bottomLeft = ((gz+1)*this.vertexCount) + gx
        const bottomRight = bottomLeft + 1
        indices[pointer++] = topLeft
        indices[pointer++] = bottomLeft
        indices[pointer++] = topRight
        indices[pointer++] = topRight
        indices[pointer++] = bottomLeft
        indices[pointer++] = bottomRight
      }
    }
    return loader.loadToVAO(vertices, textureCoords, normals, indices)
  }

}
