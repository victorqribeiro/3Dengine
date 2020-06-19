let canvas, gl, w, h, masterRenderer, camera, light, modelTexture, loader, entities, elements, terrains, grassArray, grassEntity, iTime

let keys

let img, sky

let wheel, leftClick, rightClick, middleClick, mousePos, mouseDeltaPos

let lastFrameTime, delta, player

let satusDiv

const getImageData = async imgSrc => {
    return new Promise( (resolve,reject) => {
        let img = new Image()
        img.src = imgSrc
        img.onload = () => {
            const tmp = document.createElement('canvas')
            tmp.width = img.width
            tmp.height = img.height
            const c = tmp.getContext('2d')
            c.drawImage(img, 0, 0)
            img = c.getImageData(0, 0, img.width, img.height)
            resolve(img)
            reject('err')
                
        }
    })
}

const init = async () => {
    statusDiv = document.createElement('div')
    statusDiv.style.position = "absolute"
    statusDiv.style.top = 0
    statusDiv.style.left = 0
    leftClick = false
    rightClick = false
    middleClick = false
    wheel = 0
    delta = 0.03
    lastFrameTime = performance.now()
    mousePos = {x: 0, y: 0}
    mouseDeltaPos  = {x: 0, y: 0}
    iTime = 0
    keys = {}
    canvas = document.createElement('canvas')
    canvas.width = w = innerWidth
    canvas.height = h = innerHeight
    document.body.appendChild( canvas )
    document.body.appendChild( statusDiv )
    gl = canvas.getContext('webgl2')

    const shader = new StaticShader()
    await shader.init()

    const terrainShader = new TerrainShader()
    await terrainShader.init()

    loader = new Loader()

    const playerGeometry = await OBJLoader.loadObjModel('pirate_girl')
    const playerTexture = new ModelTexture( await loader.loadTexture('pirate_girl.png'), false, true )
    const playerTextured = new TexturedModel(playerGeometry, playerTexture)

    player = new Player(
      playerTextured,
      {x: 390, y:0, z:630},
      {x: 0, y:150, z:0},
      {x: 1, y: 1, z: 1},
      false
    )

    camera = new Camera(
        player,
        {x: 390, y:5, z:630},
        {x: 17, y:0, z:0}
    )

    light = new Light(
        {x: 400, y: 1000, z: 400},
        {r: 1.0, g: 1.0, b: 1.0}
    )

    const heightMap = await getImageData("models/textures/heightMap.png")

    const backgroundTexture = new TerrainTexture( (await loader.loadTexture('grass.png')).texture )
    const rTexture = new TerrainTexture( (await loader.loadTexture('mud.png')).texture )
    const gTexture = new TerrainTexture( (await loader.loadTexture('grassFlowers.png')).texture )
    const bTexture = new TerrainTexture( (await loader.loadTexture('path.png')).texture )
    const blendMap = new TerrainTexture( (await loader.loadTexture('blendMap.png')).texture )

    const texturePack = new TerrainTexturePack(
        backgroundTexture,
        rTexture,
        gTexture,
        bTexture
    )

    terrains = []

    for(let i = 0; i < 1; i++){
        for(let j = 0; j < 1; j++){
            terrains.push(new Terrain(i, j, loader, texturePack, blendMap, heightMap))
        }
    }


    const grass = await OBJLoader.loadObjModel('pine')
    const gt = new ModelTexture( await loader.loadTexture('pine.png'), true, true )
    grassTextured = new TexturedModel(grass, gt, true)
    
    img = await getImageData('models/textures/blendMap.png')
    
    grassArray = []
    
    for(let i = 0; i < img.height; i++){
        for(let j = 0; j < img.width; j++){
            const index = (i*img.width+j)*4
            const r = img.data[index]
            const g = img.data[index+1]
            const b = img.data[index+2]
            const a = img.data[index+3]
            if( r == 0 && g == 0 && b == 0 && Math.random() < 0.01 ){
                const s = Math.random() * 1 + 1
                const x = j * (800 / img.width) 
                const z = i * (800/ img.height)
                grassArray.push(
                        new Entity(
                            grassTextured,
                            {x: x, y: terrains[0].getHeightOfTerrain(x, z) , z: z},
                            {x:0, y: Math.random() * 360, z:0},
                            {x: s, y: s, z: s}
                        )
                )
            }
                
        }
    
    }
    
    /*
    grassArray.push(
        new Entity(
            grassTextured,
            {x: 440, y: terrains[0].getHeightOfTerrain(440, 600) , z: 600},
            {x:0, y: 0, z:0},
            {x: 1, y: 1, z: 1}
        )
    )
    */
    const model = await OBJLoader.loadObjModel('stall')
    modelTexture = new ModelTexture( await loader.loadTexture('stallTexture.png') )
    const texturedModel = new TexturedModel(model, modelTexture)

    entities = [
    new Entity(
        texturedModel,
        {x:380, y: terrains[0].getHeightOfTerrain(380, 250), z:250},
        {x:0, y:180, z:0},
        {x:1, y:1, z:1}
      ),
      new Entity(
        texturedModel,
        {x:410, y: terrains[0].getHeightOfTerrain(410, 250), z:250},
        {x:0, y:130, z:0},
        {x:1, y:1, z:1}
      )
    ]

    masterRenderer = new MasterRenderer(shader, terrainShader)

    for(let i = 0; i < terrains.length; i++)
        masterRenderer.processTerrain(terrains[i])


    /*
    const sphere = await OBJLoader.loadObjModel('sphere')
    const sphereTexture = new ModelTexture( await loader.loadTexture('sky_sphere2.jpg'), true, true )
    const sphereTextured = new TexturedModel(sphere, sphereTexture)
    
    globe = new Entity(
        sphereTextured,
        {x: camera.position.x, y: camera.position.y, z: camera.position.z},
        {x: 0, y: 0, z: 0},
        {x: 350, y: 350, z: 350},
        false
    )
    */




    requestAnimationFrame( loop )
    addEvents()
}


const loop = (time) => {

    /*
    const currentFrameTime = time

    delta = (currentFrameTime - lastFrameTime) * 0.001
    lastFrameTime = currentFrameTime
    */
    
    iTime = time
    camera.move()
    player.move(terrains[0])
    
    for(let i = 0; i < entities.length; i++)
      masterRenderer.processEntity(entities[i])

    masterRenderer.processEntity( player )
    
    //masterRenderer.processEntity( globe )
    
    for(let i = 0; i< grassArray.length; i++)
        masterRenderer.processEntity( grassArray[i] )
    




    


    masterRenderer.render(light, camera)


    mouseDeltaPos.x = 0
    mouseDeltaPos.y = 0
    requestAnimationFrame( loop )
}

const addEvents = () => {
    window.onresize = () => {
        canvas.width = w = innerWidth
        canvas.height = h = innerHeight
        masterRenderer.updateProjection()
    }

    document.oncontextmenu = e => {
      e.preventDefault()
    }

    document.onmousedown = e => {
      e.preventDefault()
      switch(e.button){
        case 0 :
          leftClick = true
          break
        case 1 :
          middleClick = true
          break
        case 2 :
          rightClick = true
          break
      }
    }

    document.onmouseup = e => {
      e.preventDefault()
      switch(e.button){
        case 0 :
          leftClick = false
          break
        case 1 :
          middleClick = false
          break
        case 2 :
          rightClick = false
          break
      }
    }

    document.onmousemove = e => {
       mouseDeltaPos.x = e.clientX - mousePos.x
       mouseDeltaPos.y = e.clientY - mousePos.y
       mousePos.x = e.clientX
       mousePos.y = e.clientY
    }

    document.onkeydown = e => {
        keys[e.keyCode] = true
    }

    document.onkeyup = e => {
        keys[e.keyCode] = false
    }

    document.onwheel = e => {
      wheel += e.deltaY /  Math.abs(e.deltaY) * 2
      wheel = Math.max(Math.min(wheel, 20), -20)
    }
}

init()
