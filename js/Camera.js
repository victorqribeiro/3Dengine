class Camera {

    constructor(player, position, rotation){
        this.player = player
        this.position = position
        this.rotation = rotation
        this.speed = 0.2

        this.distanceFromPlayer = 28
        this.angleAroundPlayer = 0

    }

    move(){

      this.distanceFromPlayer = 28 + wheel

      if(rightClick)
        this.rotation.x += mouseDeltaPos.y * 0.3
      this.rotation.x = Math.max(Math.min(this.rotation.x, 50), 10)


      if(rightClick)
        this.angleAroundPlayer -= mouseDeltaPos.x

      const a = glMatrix.toRadian(this.rotation.x)
      const horizontalDistance = this.distanceFromPlayer * Math.cos(a)
      const verticalDistance = this.distanceFromPlayer * Math.sin(a)

      const theta = glMatrix.toRadian(this.player.rotation.y + this.angleAroundPlayer)
      const offsetX = horizontalDistance * Math.sin(theta)
      const offsetZ = horizontalDistance * Math.cos(theta)
      this.position.x = this.player.position.x - offsetX
      this.position.z = this.player.position.z - offsetZ
      this.position.y = this.player.position.y + 2 + verticalDistance
      this.rotation.y = 180 - (this.player.rotation.y + this.angleAroundPlayer)

        /*
        if(keys[87]){
            const a = glMatrix.toRadian(this.rotation.y)
            this.position.x -= Math.sin(a) * this.speed
            this.position.z -= Math.cos(a) * this.speed
        }else if(keys[83]){
            const a = glMatrix.toRadian(this.rotation.y)
            this.position.x += Math.sin(a) * this.speed
            this.position.z += Math.cos(a) * this.speed
        }

        if(keys[65]){
            const a = glMatrix.toRadian(this.rotation.y)
            this.position.x -= Math.cos(a) * this.speed
            this.position.z -= Math.sin(a) * this.speed
        }else if(keys[68]){
            const a = glMatrix.toRadian(this.rotation.y)
            this.position.x += Math.cos(a) * this.speed
            this.position.z += Math.sin(a) * this.speed
        }

        if(keys[38]){
            this.position.y += this.speed
        }else if(keys[40]){
            if(this.position.y > 1)
              this.position.y -= this.speed
        }

        if(keys[37])
            this.rotation.y -= 1
        else if(keys[39])
            this.rotation.y += 1

        */
    }

}
