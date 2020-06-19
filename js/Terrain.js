class Terrain {

  constructor(gridX, girdZ, loader, texturePack, blendMap, heightMap){
    this.size = 800
    this.MAX_HEIGHT = 40
    this.vertexCount = heightMap.height
    this.x = gridX * this.size
    this.z = girdZ * this.size
    this.heights = Array(this.vertexCount).fill().map( _ => Array(this.vertexCount).fill(0) )
    this.rawModel = this.generateTerrain(loader, heightMap)
    this.texturePack = texturePack
    this.blendMap = blendMap
  }

  getHeightOfTerrain(worldX, worldZ){
    const terrainX = worldX - this.x
    const terrainZ = worldZ - this.z
    const gridSquareSize = this.size / (this.heights.length - 1)
    const gridX = Math.floor(terrainX/gridSquareSize)
    const gridZ = Math.floor(terrainZ/gridSquareSize)
    if( gridX >= this.heights.length - 1 || gridZ >= this.heights.length - 1 || gridX < 0 || gridZ < 0 )
        return 0
    const xCoord = (terrainX % gridSquareSize) / gridSquareSize
    const zCoord = (terrainZ % gridSquareSize) / gridSquareSize
    if( xCoord <= 1 - zCoord )
        return Maths.barryCentric(
            {x: 0, y: this.heights[gridX][gridZ], z: 0},
            {x: 1, y: this.heights[gridX + 1][gridZ], z: 0},
            {x: 0, y: this.heights[gridX][gridZ + 1], z: 1},
            {x: xCoord, y: zCoord}
        )
    else
        return Maths.barryCentric(
            {x: 1, y: this.heights[gridX + 1][gridZ], z: 0}, 
            {x: 1, y: this.heights[gridX + 1][gridZ + 1], z: 1},
            {x: 0, y: this.heights[gridX][gridZ + 1], z: 1},
            {x: xCoord, y: zCoord}
        )
  }



  generateTerrain(loader, heightMap){
    const count = this.vertexCount * this.vertexCount
    const vertices = Array(count * 3)
    const normals = Array(count * 3)
    const textureCoords = Array(count * 2)
    const indices = Array(6*(this.vertexCount-1)*(this.vertexCount-1))
    let vertexPointer = 0
    for(let i = 0; i < this.vertexCount; i++){
      for(let j = 0; j < this.vertexCount; j++){
        vertices[vertexPointer*3] = j/(this.vertexCount - 1) * this.size
        const height = this.getHeight(j,i, heightMap)
        this.heights[j][i] = height
        vertices[vertexPointer*3+1] = height
        vertices[vertexPointer*3+2] = i/(this.vertexCount - 1) * this.size
        const norm = this.calculateNormal(j, i, heightMap)
        normals[vertexPointer*3] = norm.x
        normals[vertexPointer*3+1] = norm.y
        normals[vertexPointer*3+2] = norm.z
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
  
  getHeight(x, z, image){
    if( x < 0 || x >= image.width || z < 0 || z >= image.height )
        return
    return image.data[(z*image.width+x)*4] / 256 * this.MAX_HEIGHT - this.MAX_HEIGHT/2
  }
  
  calculateNormal(x, z, image){
    const heightL = this.getHeight(x-1, z, image)
    const heightR = this.getHeight(x+1, z, image)
    const heightT = this.getHeight(x, z+1, image)
    const heightB = this.getHeight(x, z-1, image)
    let xN = heightL - heightR
    let yN = 2
    let zN = heightB - heightT
    const vectorLenght = Math.sqrt( xN*xN + yN*yN + zN*zN )
    xN /= vectorLenght
    yN /= vectorLenght
    zN /= vectorLenght
    return {x: xN, y: yN, z: zN}
  }

}
