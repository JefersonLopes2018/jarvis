const Discord = require("discord.js"); 
const client = new Discord.Client(); 
const config = require("./config.json"); 
const jimp =require("jimp");


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('banco.json')
const db = low(adapter)


client.on("ready", () => {
  console.log('Estou Pronto para ser usado!');
  console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
});

client.on("guildMemberAdd", async member => {
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
  let server = member.guild.id
  let fonte = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
  let mask = await jimp.read('mascara.png')
  let fundo = await jimp.read('fundo.png')
  const memberAvatar = member.user.avatarURL({ type: 'png', dynamic: true }).replace('webp', 'png')
  jimp.read(memberAvatar).then(avatar => {
  avatar.resize(130, 130)
  mask.resize(130, 130)
  avatar.mask(mask)
  fundo.print(fonte, 170, 175, member.user.username)
  fundo.composite(avatar, 40, 90).write('bemvindo.png')

  let servidores = db.get('servidores').find({id : server}).value()
  let chave = Object.keys(servidores)
  for (var i = 0; i < chave.length; i++){
    if(chave[i] === 'welcome'){
      let canal = client.channels.cache.get(servidores[chave[i]])
      const envio = canal.send(`${member}`, { files: ["bemvindo.png"] })
      
  }
   
  }
  console.log('Imagem enviada para o Discord')
  })
  .catch(err => {
  console.log('error avatar')
  })
})
client.on("guildMemberRemove",async member => {
  let staff = client.channels.cache.get("425150435725279253")
  if (!client.guilds.cache.some(guild => guild.members.cache.has(member.id))) {
      client.users.cache.delete(member.id);
  }
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' }).catch(console.error);
  
  staff.send(`${member} saiu de nossos servidores`)
});

client.on("guildCreate", async server => {
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
  const servidor = server.id
  const name = server.name
  const afk = await server.roles.create({ data: {name: 'AFK'},})
  const id = afk.id
  db.get('servidores')
  .push({
  id: servidor,
  nome: name,
  cargo: id
  }).write()
  })
client.on("guildDelete", async server => {
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
  const servidor = server.id
  db.get('servidores').remove({id : servidor}).write()
})


client.on("message", async message => {

  if(message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
  
  //autenticação 
  if (comando === 'login'){
    try{
    const busca = await message.fetch("login")
    busca.delete()
    let server = message.guild.id
    const cargo = args[0]
    const senha = args[1]
    if(server != '343227251501957121')return message.channel.send('Você está tentando logar fora do servidor Oficial!')
    if(!cargo)return message.channel.send('Não foi informado o cargo pelo qual quer fazer login.')
    if(cargo === 'membro'){
      const add = await message.member.roles.add("423629707762728970")
      const confirmar = await message.channel.send(" :arrows_counterclockwise: **CARREGANDO**")
      setTimeout(()=> confirmar.edit("**.**"),1000)
      setTimeout(()=> confirmar.edit("**..**"),1000);
      setTimeout(()=> confirmar.edit("**...**"),1000);
      setTimeout(()=> confirmar.edit(`:white_check_mark: Login feito como **${cargo}**`),3000);
    }
    if(cargo === 'byte'){
      if(senha === 'olaph'){
        const add = await message.member.roles.add("750434798870462626")
        const confirmar = await message.channel.send(" :arrows_counterclockwise:**CARREGANDO**")
        setTimeout(()=> confirmar.edit("**.**"),1000)
        setTimeout(()=> confirmar.edit("**..**"),1000);
        setTimeout(()=> confirmar.edit("**...**"),1000);
        setTimeout(()=> confirmar.edit(`:white_check_mark: Login feito como **${cargo}**`),3000);
      }
      else{
        message.channel.send(`:x: **Acesso negado!**`)
      }
    }
    if(cargo === 'faculdade'){
      if(senha === '5725'){
        const add = await message.member.roles.add("481485196462522388")
        const confirmar = await message.channel.send(" :arrows_counterclockwise:**CARREGANDO**")
        setTimeout(()=> confirmar.edit("**.**"),1000)
        setTimeout(()=> confirmar.edit("**..**"),1000);
        setTimeout(()=> confirmar.edit("**...**"),1000);
        setTimeout(()=> confirmar.edit(`:white_check_mark: Login feito como **${cargo}**`),3000);
      }
      else{
        message.channel.send(`:x: **Acesso negado!**`)
      }
    }
  }
  catch{
    console.error()
  }
  }
  //sistema de fala
  if (comando === "falar"){
    try{
    const busca = await message.fetch("")
    busca.delete()
    let id = args[0]
    let mensagem = args.slice(1).join(' ')
    let canal = client.channels.cache.get(id);
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      try{const envio = await canal.send(mensagem)}
      catch{const erro = await message.author.send(":x: Não foi possivel enviar a mensagem!")}
    }
  }catch{
    console.error()
  }
  }
  if(comando === "avisar"){
    try{
    const busca = await message.fetch("avisar")
    busca.delete()
    let avisos = client.channels.cache.get("392711722172940298");
    const mensagem = args.join(" ");
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      try{
          const envio = await avisos.send(mensagem)
          const confirmar = await message.channel.send(":white_check_mark:  mensagem enviada com sucesso!")}
      catch{
        const erro = await message.author.send(":x: Não foi possivel enviar a mensagem!");
      }
      
    }
    else{
      const permissao = await message.channel.send(`${message.author} Não recebo ordens de você!`);
    }
    }catch{
      console.error()
    }
  }
  if(message.channel.type === "dm"){
    try{
    let staff = client.channels.cache.get("425150435725279253");
    try{
      const msg = `O membro **${message.author}** respondeu: \n ${message.content}`
      const envio = await staff.send(msg)}
    catch{
      const erro = await message.author.send(":x: Não foi possivel enviar a mensagem!");
    }
  }catch{
    console.error()
  }
  }
  if(comando === "privado"){
    try{
    const busca = await message.fetch("privado")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872" || message.author.id == "703636663473274962"){
      let membro = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      let mensagem = args.slice(1).join(' ')
  
      if(!membro)return await message.channel.send("Você não informou um membro!");
      if(!mensagem)return await message.channel.send("Você não informou uma mensagem!");
      try{
        const envio = await membro.send(mensagem)
        const confirmar = await message.channel.send(`<**${mensagem}**> foi enviada com sucesso para ${membro}!`)
        }
      catch{const erro = await message.author.send(" :frowning2:  Não foi possivel enviar a mensagem!");}
        }
    }catch{
      console.error()
    }
  }
  if(comando ==="time"){
    try{
    const busca = await message.fetch("time")
    busca.delete()
    let time = args[0]
    let tempo = time * 1000 * 60
    let id = args[1]
    let mensagem = args.slice(2).join(' ')
    let canal = client.channels.cache.get(id);
    try{
    const dados = await message.channel.send(`:clock2: Sera enviado **${mensagem}** no canal ${canal} daqui a ${time} minutos.`)
    setTimeout(()=> canal.send(mensagem),tempo)
    }
    catch{const erro = awaitmessage.author.send(":frowning2: Não foi possivel enviar a mensagem!");}
    }catch{
      console.error()
  }
  }
  if(comando === "noticia"){
    try{
    const busca = await message.fetch("noticia")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      const imagem = args[0]
      const fonte = args[1]
      let texto = args.slice(2).join(' ')
      let canal = client.channels.cache.get("714572433822187571")
      try{
        const envio = await canal.send( { files: [imagem] })
        if(texto){
          setTimeout(()=> canal.send(texto),1000)
        }
        setTimeout(()=>canal.send("**Fonte:** " + fonte),2000)
        const confirmar = await message.channel.send(":incoming_envelope: Noticia postada com sucesso!")
    }
    catch{
        const erro = await message.author.send(":frowning2: Não foi possivel enviar a noticia");
    }}
  }catch{
    console.error()
  }
  }
  if(comando ==="foto"){
    try{
    const busca = await message.fetch("foto")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    let link = args[0]
    let tipo = args[1]
    let mensagem = args.slice(3).join(' ')
    if(!mensagem){
      let mensagem = ``
    }
    if(tipo === "canal"){
      let id = args[2]
      let canal = client.channels.cache.get(id)
      try{
        const envio = await canal.send(mensagem, { files: [link] })
        const confirmar = await message.channel.send(" :white_check_mark: Foto enviada com sucesso!")
      }
      catch{
        const erro = await message.author.send("Erro no envio da Foto para o canal!")
      }
    }
    if(tipo === "membro"){
      let membro =  message.mentions.members.first() || message.guild.members.cache.get(args[2])
      try{
        const envio = await membro.send(mensagem, { files: [link] })
        await message.channel.send(" :white_check_mark: Foto enviada com sucesso!")
      }
      catch{
        const erro = await message.author.send(`Erro no envio da Foto para o ! ${membro}`)
      }
    }}
    }catch{
      console.error()
    }
  }
  if (comando === "aqui"){
    try{
    const busca = await message.fetch("aqui")
    busca.delete()
    let servidores = db.get('servidores').value()

    for (var i = 0; i < servidores.length; i++){
      let objeto = servidores[i]
      let chave = Object.keys(objeto)
      const indicie = chave.indexOf('canal')
      if(chave[indicie] === 'canal'){
        let canal = client.channels.cache.get(objeto[chave[indicie]])
        canal.send(`${message.author} :loud_sound:  Está em call no servidor ${message.guild}.`)
      }
    }
    }catch{
      console.error()
    }
  }
  if(message.content.startsWith('jarvis')) {
    try{
      const busca = await message.fetch("jarvis")
      busca.delete()
      let canal = client.channels.cache.get("425150435725279253");
      const mensagem = args.join(' ')
      try{
        const resposta = await message.channel.send(`:slight_smile: ${message.author} Opa beleza ?`);
        const info = await canal.send(` Mensagem: **${mensagem}** \n Author: **${message.author}**`)
        }
      catch{
        const erro = await message.channel.send(":yawning_face: Não entendi nada!")
      }
    }catch{
      console.error()
    }
  }
///////////Banco de Dados////////////////
  if(comando === 'newbiblioteca'){
    try{
      const busca = await message.fetch("biblioteca")
      busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      try{
          const biblioteca = args[0]
          db.set(biblioteca, []).write()
          const envio = await message.channel.send(`:white_check_mark: Biblioteca **${biblioteca}** Criada com sucesso!`)}
      catch{
        const erro = await message.author.send(':x: Erro ao criar biblioteca.')
      }
    }
    else{
      const permissao = await message.channel.send('Sem permissão!')
    }
    }catch{
      console.error()
    }
  }
  if(comando === 'newitem'){
    try{
      const busca = await message.fetch("")
      busca.delete()
      const biblioteca = args[0]
      const nome = args[1]
      const valor = args[2]
      try{
        db.get(biblioteca)
        .push({
        id: nome,
        valor: valor
        }).write()
        const envio = await message.channel.send(`:white_check_mark: **${nome}** adicionado a biblioteca ${biblioteca} com sucesso!`)}
      catch{
        const erro = await message.author.send(':x: Erro ao criar o item.')
      }
  }catch{
    console.error()
  }
  }
  if(comando === 'newchave' || comando === 'editchave'){
    try{
      const busca = await message.fetch("")
      busca.delete()
      const biblioteca = args[0]
      const item = args[1]
      const chave = args[2]
      const valor = args.slice(3).join(' ')
      if(!args[0])return message.channel.send('Você não informou a biblioteca.')
      if(!args[1])return message.channel.send('Você não informou o item.')
      if(!args[2])return message.channel.send('Você não informou a chave que quer adicionar.')
      if(!args[3])return message.channel.send('Você não informou o valor da chave')
      try{
        db.get(biblioteca)
        .find({id: item}).assign({[chave]: valor}).write()
        const envio = await message.channel.send(`:white_check_mark: chave ${chave} foi adicionada com sucesso!.`)  
        }
    catch{
      const erro = await message.author.send(':x: Erro ao adicionar chave.')
    }
  }catch{
    console.error()
  }
  }
  if(comando === 'delitem'){
    try{
    const busca = await message.fetch("")
    busca.delete()
    const biblioteca = args[0]
    const item = args[1]
    if(!biblioteca)return message.channel.send('Você não informou a biblioteca.')
    if(!item)return message.channel.send('Você não informou o item.')

    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      db.get(biblioteca).remove({id: item}).write()
      const confirmar = await message.channel.send(':white_check_mark: Item deletado com sucesso!')
    }
    else{
      const permissao = await message.channel.send(":x: Você não tem permissão!")
    }
  }catch{
    console.error()
  }
 }
  if(comando === 'acessar'){
    try{
    const busca = await message.fetch("")
    busca.delete()
    const biblioteca = args[0]
    const item = args[1]
    const especificaçao = args[2]
    if(!item){
      if(!biblioteca)return message.channel.send(':x: Não informou a biblioteca.')
      try{
        let document = db.get(biblioteca).value()
        let msg = ' '
        for (var i = 0; i < document.length; i++){
          let objeto2 = document[i]
          let chave2 = Object.keys(objeto2)
          if(biblioteca === 'servidores'){
            message.channel.send(objeto2[chave2[1]])
          }
          else{
            message.channel.send(objeto2[chave2[0]])
          }
        }
      }
      catch{
        const erro = await message.channel.send(':x: Erro ao achar a biblioteca informada.')
      }
    }
    else{
      try{
      let objeto = db.get(biblioteca).find({id: item}).value()
      let chave = Object.keys(objeto)
  
      for (var i = 0; i < chave.length; i++) {
        if(!especificaçao){
          if(chave[i] === 'valor'){
            message.channel.send(objeto[chave[i]])
            }
        }
        else{
          if(chave[i]=== especificaçao){
            message.channel.send(objeto[chave[i]])
          }
        }
      }
    }
       catch{
        const erro = await message.channel.send('Erro ao achar o item informado.')
       }
    }
  }catch{
    console.error()
  }
  }
////////////////////////////////////////

//cargos 
  if(comando === "newcargo"){
    try{
        const busca = await message.fetch("newcargo")
        busca.delete()
        let nome = args[0]
        if(!nome)return message.channel.send(':x: Não informou o nome do cargo.')
          try{
            const cargo = await message.guild.roles.create({ data: {
            name: nome,
            },})
            await message.author.send(':white_check_mark: Cargo criado com sucesso! ')
           }
          catch{
            const erro = await message.author.send(':x: Erro ao criar o novo cargo.')
          }
    }catch{
      console.error()
    }
  }
  if(comando === "delcargo"){
    try{
      const busca = await message.fetch("excargo")
      busca.delete()
      try{
        const cargo = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.roles;
        cargo.delete()
        const confirmar = await message.channel.send(":white_check_mark: Cargo deletado com sucesso!")
      }
      catch{
        const erro = await message.author.send(":x: Erro ao deletar o cargo!")
      }
    }catch{
      console.error()
    }
  }
  if (comando === "afk"){
    try{
      const busca = await message.fetch("afk")
      busca.delete()
      let servidor = db.get('servidores').find({id : message.guild.id}).value()
      let chave = Object.keys(servidor)
      for (var i = 0; i < chave.length; i++) {
        if(chave[i] === 'cargo'){
          let cargo = message.guild.roles.cache.get(servidor[chave[i]])
          if(!cargo)return
          if (!message.member.roles.cache.has(cargo.id)) {
            const add = await message.member.roles.add(cargo.id)
            const confirmar = await message.channel.send(" :inbox_tray:**CARREGANDO**")
            setTimeout(()=> confirmar.edit("**.**"),2000)
            setTimeout(()=> confirmar.edit("**..**"),2000);
            setTimeout(()=> confirmar.edit("**...**"),2000);
            setTimeout(()=> confirmar.edit("Seu status foi definido para: :x: **OFFLINE**"),3000);
          } 
          else {
            const remover = await message.member.roles.remove(cargo.id)
            const confirmar = await message.channel.send(" :inbox_tray: **CARREGANDO**")
            setTimeout(()=> confirmar.edit("**.**"),2000)
            setTimeout(()=> confirmar.edit("**..**"),2000);
            setTimeout(()=> confirmar.edit("**...**"),2000);
            setTimeout(()=> confirmar.edit("Seu status foi definido para:  :white_check_mark:**ONLINE**"),3000);
          
           }
        }
  }
  }catch{
    console.error()
  }
  }
//sistema de verificação
  if(comando === "status"){
    try{
    const busca = await message.fetch("status")
    busca.delete()
    const servidores = client.guilds.cache.map(a =>`${a.name}` )
    if(args[0]=== 'servidores' ){
      if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
          const envio = await message.channel.send(`**Servidores cadastrados: ** ${servidores}`)
          const canais = client.channels.cache.map(a =>  message.author.send(`${a.name} : ${a.id}\n`))
      }
      else{
        const permissao = await message.author.send(`:x: Você não tem acesso!`)
      }
    }
    else{
    const status = await message.channel.send(":arrows_counterclockwise: **CARREGANDO**");
    setTimeout(()=> status.edit("**.**"),2000)
    setTimeout(()=> status.edit("**..**"),2000);
    setTimeout(()=> status.edit("**...**"),2000);
    setTimeout(() => status.edit(`:bar_chart: Funcionando com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`), 4000);
  }
  }catch{
    console.error()
  }
  }
  if(comando === "verificar"){
    try{
    const busca = await message.fetch("verificar")
    busca.delete()

    let servidores = db.get('servidores').find({id : message.guild.id}).value()
    let chave = Object.keys(servidores)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    for (var i = 0; i < chave.length; i++) {
        if(chave[i] === 'cargo'){
          let cargo = message.guild.roles.cache.get(servidores[chave[i]])
          if(!cargo)return
          if (message.member.roles.cache.has(cargo.id)) {
            const r = await message.channel.send(":x: offline")
          } 
          else {
           const r = await message.channel.send(":white_check_mark: online")
         }
          }
    }
  }catch{
    console.error()
  }
  }
  
  if(comando === "mostrar"){
    try{
    const busca = await message.fetch("mostrar")
    busca.delete()
    const tipo = args[0]
    const nome = args[1]
    membro = message.mentions.members.first() || message.guild.members.cache.get(args[2]) || message.member;
    if(!tipo){
      const erro = await message.channel.send(`${message.author} Busca invalida!`)
    }
    else if(tipo === "dono"){
      const resposta = await message.channel.send(`Criador do servidor: **${message.guild.owner.user.username}**`)
    }
    else if(tipo === "data"){
        if(!nome)return message.channel.send(`${message.author} Busca invalida!`)
        if(nome === "canal"){
          const id = args[2]
          if(!id)return message.channel.send("Você não informou o ID do canal.")
        
          const canal =  client.channels.cache.get(id);
          const dados =  canal.createdAt
          let data = dados.toLocaleDateString()
          const resposta = await message.channel.send(`${canal} foi criado em **${data}**`)

        }
        if(nome ==="membro"){
          const dados = membro.user.createdAt
          let data = dados.toLocaleDateString()
          const resposta = await message.channel.send(`O membro ${membro} entrou no discord em **${data}**`)
        }
      }
    else if(tipo === "canal"){
        if(!nome)return message.channel.send(`${message.author} Busca invalida!`)
        if(nome === "lista"){
          const lista = await message.guild.channels.cache.map((i) => i.name);
          const enviar = await message.channel.send(lista)
        }
        else{
          try{
            let channel = message.guild.channels.cache.find(c => c.name === nome);
            const resposta = await message.channel.send(`${message.author} Encontrei canal com esse nome. \n ID: ${channel.id}`)
          }
          catch{
            const channelServer = client.channels.cache.map(c => {
                if(c.name === nome){
                  return c.id
                }
                else{
                  return false
                }
              })
              var indice = channelServer.indexOf(false)
              while(indice >= 0){
                channelServer.splice(indice, 1);
                var indice = channelServer.indexOf(false);
                }
              if(channelServer.length == 0 || channelServer == null){
                const erro = await message.channel.send('Esse canal não faz parte do meu sistema.')
              }
              else{
                const resposta = await message.channel.send(`${message.author} Encontrei seu canal em outro servidor. \n ID: ${channelServer}`)
              }
          }
        }
    }
  }catch{
    console.error()
  }
  }
  //salas
  if(comando === "sala"){
    try{
    const busca = await message.fetch("sala")
    busca.delete()
    try{
      const categoria = await message.guild.channels.create("🎮SALA", {type: "category"}).catch(console.error);
      let categoriaID = message.guild.channels.cache.find(c => c.name === "🎮SALA"); 
      const canal =  await message.guild.channels.create("💬chat", {type: "text" , parent: categoria.id }).catch(console.error);
      const voice =  await message.guild.channels.create("🔊CHAMADA", {type: "voice" , parent: categoria.id }).catch(console.error);
      const resposta = await message.channel.send(":white_check_mark: Sala criada!")
    }
    catch{
      const erro= await message.author.send("Erro ao criar uma sala!")
    }  
    }catch{
    console.error()
  }
    }
  if(comando ==="delsala"){
    try{
    const busca = await message.fetch("salap")
    busca.delete()
    try{
      let categoria = message.guild.channels.cache.find(c => c.name === "🎮SALA");
      let text = message.guild.channels.cache.find(c => c.name === "💬chat");
      let voice = message.guild.channels.cache.find(c => c.name === "🔊CHAMADA");
      const apagar = await categoria.delete()
      const apagar1 = await text.delete()
      const apagar2 = await voice.delete()
      const resposta = await message.channel.send(":white_check_mark: Sala Deletada")
    }
    catch{
      const erro = await message.author.send("Erro ao deletar sala!")
  }
  }catch{
  console.error()
  }
  }
  //moderação
  if(comando === "delchannel"){
    try{
    let id = args.join(" ")
    let canal = client.channels.cache.get(id);
   
    const busca = await message.fetch("delchannel")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      if(!id){
        const r = await message.channel.send(`${message.author} Não enviou nenhum ID para eu apagar!`)
          }
      else{
        try{
          const apagarCanal = await canal.delete()
          await message.channel.send(':white_check_mark: Canal deletado!')
      }
      catch{
        const erro = await message.author.send(":x: Erro ao apagar canal.")
      }
    }
    }
    else{
    const erro = await message.channel.send(`${message.author} Não recebo ordens de você! `)
    }
    }catch{
      console.error()
    }
  }
  if(comando === "newchannel"){
    try{
    const busca = await message.fetch("newchannel")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      let nome = args[0]
      let tipo = args[1]
      let categoria = args[2]
  
      if(!nome){
        const erro = await message.channel.send(`${message.author} Tentativa invalida. você não informou o nome.`)
      }
      else{
        try{
          await message.guild.channels.create(nome, {type: tipo, parent: categoria})
          await message.channel.send(":white_check_mark: Canal criado com sucesso!")
        }
        catch{
          await message.author.send("Erro ao criar canal!")
        }
      }
    }
  }catch{
    console.error()
  }
  }
  if (comando === "kick"){
    try{
    const busca = await message.fetch("kick")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      const membro = message.mentions.members.first()
      try{
       await membro.kick()
       await message.channel.send(':white_check_mark: Membro espulso com sucesso!')
      }
      catch{
        await message.author.send(":x: Erro ao expulsar o membro.")
      }
    }
    else{
       await message.channel.send(`${message.author} Não recebo ordens de você!!`);
    }
  }catch{
    console.error()
  }
  }
  if(comando === "delete"){
    try{
    const busca = await message.fetch("delete")
    busca.delete()
    let qt = args[0]
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      if(!qt){
      const erro = await message.channel.send(`${message.author} Não me informou quantas mensagens devo apagar!`)
      }
    else{
      try{
        setTimeout(() => {message.channel.bulkDelete(qt);}, 2000);
      }
      catch{
        await message.author.send("Erro ao deletar mensagem!!")
      }
    }
  }
  }catch{
    console.error()
  }
  }
  if(comando === "state"){
    try{
    const busca = await message.fetch("state")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    if (args[0] == 'reset'){
      client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
    }
    else{
    const status = args.join(' ')
    client.user.setActivity(status, { type: 'PLAYING' })
    .catch(console.error);
    }
    }
  }catch{
      console.error()
    }
  } 
  
});

client.login(config.token);
