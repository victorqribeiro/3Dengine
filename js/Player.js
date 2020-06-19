class Player extends Entity {

  constructor(texturedModel, position, rotation, scale, hideIfOutOfFOV){
    super(texturedModel, position, rotation, scale, hideIfOutOfFOV)
    this.RUN_SPEED = 20
    this.TURN_SPEED = 160
    this.GRAVITY = -50
    this.JUMP_POWER = 30
    this.jumpSpeed = 0
    this.isJumping = false
  }

  move(terrain){
  
    const terrainHeight = terrain.getHeightOfTerrain(this.position.x, this.position.z)

    if(keys[87]){

      const a = glMatrix.toRadian(this.rotation.y)
      const speed = this.RUN_SPEED * delta
      const futurePosX = Math.sin(a) * speed
      const futurePosZ = Math.cos(a) * speed
      //if(this.isValidLocation(futurePosX, futurePosZ)){
          this.position.x += futurePosX
          this.position.z += futurePosZ
      //}
    }else if(keys[83]){
      const a = glMatrix.toRadian(this.rotation.y)
      const speed = this.RUN_SPEED * delta
      this.position.x -= Math.sin(a) * speed
      this.position.z -= Math.cos(a) * speed
    }

    if(keys[65]){
      this.rotation.y += this.TURN_SPEED * delta
    }else if(keys[68]){
      this.rotation.y -= this.TURN_SPEED * delta
    }

    if(keys[32] && !this.isJumping){
      this.jumpSpeed = this.JUMP_POWER
      this.isJumping = true
    }

    this.jumpSpeed += this.GRAVITY * delta
    this.position.y += this.jumpSpeed * delta
    
    if(this.position.y <= terrainHeight){
      this.jumpSpeed = 0
      this.position.y = terrainHeight
      this.isJumping = false
    }


  }
  
  isValidLocation(futurePosX, futurePosZ){
    const rgb = this.getPixelCollision(futurePosX, futurePosZ)
    return  rgb.r < 20 && rgb.g < 20 && rgb.b > 128 
  }
  
  getPixelCollision(futurePosX, futurePosZ){
    const x = Math.floor((this.position.x+futurePosX) / 800 * img.width)
    const y = Math.floor((this.position.z+futurePosZ) / 800 * img.height)
    const index = (y*img.width+x) * 4
    return {r: img.data[index], g: img.data[index+1], b: img.data[index+2]}
  }

}
