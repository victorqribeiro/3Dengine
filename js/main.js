let canvas, gl, w, h, masterRenderer, camera, light, modelTexture, loader, mousePos, keys, entities, elements, terrains, terrain2, grassEntity

const init = async () => {
    mousePos = {x: 0, y: 0}
    keys = {}
    canvas = document.createElement('canvas')
    canvas.width = w = innerWidth
    canvas.height = h = innerHeight
    document.body.appendChild( canvas )
    gl = canvas.getContext('webgl2')

    const shader = new StaticShader()
    await shader.init()

    const terrainShader = new TerrainShader()
    await terrainShader.init()

    loader = new Loader()

    camera = new Camera(
        {x: 400, y:2, z:400},
        {x: 0, y:0, z:0}
    )

    light = new Light(
        {x: 400, y: 100, z: 400},
        {r: 1.0, g: 1.0, b: 1.0}
    )

    const model = await OBJLoader.loadObjModel('stall')
    modelTexture = new ModelTexture( await loader.loadTexture('stallTexture.png') )
    const texturedModel = new TexturedModel(model, modelTexture)

    const grass = await OBJLoader.loadObjModel('grassModel')
    const gt = new ModelTexture( await loader.loadTexture('grassTexture.png'), true, true )
    grassTextured = new TexturedModel(grass, gt)

    grassEntity = new Entity(
        grassTextured,
        {x:400, y:0, z:390},
        {x:0, y:0, z:0},
        {x:1, y:1, z:1}
    )

    /*
    elements = []
    for(let i = 0; i < 200; i++){
      elements.push(
        new Entity(
          texturedModel,
          {x: Math.random() * 100 - 50, y: Math.random() * 100 - 50, z: Math.random() * 100 - 50},
          {x: Math.random() * 360, y: Math.random() * 360, z: Math.random() * 360},
          {x: 1, y: 1, z: 1}
        )
      )
    }
    */

    entities = [
    new Entity(
        texturedModel,
        {x:380, y:0, z:350},
        {x:0, y:180, z:0},
        {x:1, y:1, z:1}
      ),
      new Entity(
        texturedModel,
        {x:410, y:0, z:350},
        {x:0, y:130, z:0},
        {x:1, y:1, z:1}
      )
    ]


    
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
    
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            terrains.push(new Terrain(j, i, loader, texturePack, blendMap)) 
        }
    }


    masterRenderer = new MasterRenderer(shader, terrainShader)

    loop()
    addEvents()
}


const loop = () => {
    camera.move()

    /*
    for(let i = 0; i < elements.length; i++)
      masterRenderer.processEntity(elements[i])
    */
    for(let i = 0; i < terrains.length; i++)
        masterRenderer.processTerrain(terrains[i])

    
    for(let i = 0; i < entities.length; i++)
      masterRenderer.processEntity(entities[i])

    masterRenderer.processEntity( grassEntity )



    masterRenderer.render(light, camera)

    requestAnimationFrame( loop )
}

const addEvents = () => {
    window.onresize = () => {
        canvas.width = w = innerWidth
        canvas.height = h = innerHeight
        masterRenderer.updateProjection()
    }

    document.onmousemove = e => {
       mousePos.x = e.clientX
       mousePos.y = e.clientY
    }

    document.onkeydown = e => {
        keys[e.keyCode] = true
    }

    document.onkeyup = e => {
        keys[e.keyCode] = false
    }
}

init()
