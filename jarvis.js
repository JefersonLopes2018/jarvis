const Discord = require("discord.js"); 
const {MessageEmbed} = require('discord.js');
const {MessageAttachment } = require('discord.js');
const client = new Discord.Client(); 
const config = require("./config.json"); 
const jimp =require("jimp");

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('banco.json')
const db = low(adapter)

var sala = new Object();
sala.aberta = false
sala.dono = ''
sala.chave = ''
sala.cargo = ''

client.on("ready", () => {
  console.log('Iniciando...');
  console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
  client.user.setActivity(`${client.users.cache.size} usuários em ${client.guilds.cache.size} servidores.`, { type: 'PLAYING' });
});

client.on("guildMemberAdd", async member => {
  let staff = client.channels.cache.get("425150435725279253")
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
  staff.send(`**${member.user.tag}** entrou no servidor **${member.guild}**`)
  })
  .catch(err => {
  console.log(err, 'error avatar')
  })
})
client.on("guildMemberRemove",async member => {
  let staff = client.channels.cache.get("425150435725279253")
  if (!client.guilds.cache.some(guild => guild.members.cache.has(member.id))) {
      client.users.cache.delete(member.id);
  }
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' }).catch(console.error);
  
  staff.send(`**${member.user.tag}** saiu do servidor **${member.guild}**`)
});

client.on("guildCreate", async server => {
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
  const servidor = server.id
  const name = server.name
  db.get('servidores')
  .push({
  id: servidor,
  nome: name
  }).write()
  })
client.on("guildDelete", async server => {
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
  const servidor = server.id
  db.get('servidores').remove({id : servidor}).write()
})
client.on("message", async message => {
  //Config 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
  const Cor = '#00BFFF'
  const consoleServer = client.channels.cache.get("425150435725279253");

  const erro = new MessageEmbed()
      .setTitle('ERRO!')
      .setColor('#FF0000')
      .setThumbnail('https://cdn.discordapp.com/attachments/714573856613859339/789552509903044638/erro.png')
      .setTimestamp()
      .setFooter('Covil', 'https://cdn.discordapp.com/attachments/425141386266935296/782306680759124028/icone.png');
  
  if(message.author.bot) return;
  if (message.channel.type != "dm" && !message.content.startsWith('jarvis') && !message.content.startsWith(config.prefix)){
    if(message.mentions.members.first()) {
      if(message.mentions.members.first().id == '703636663473274962'){
        await message.channel.send(`${message.author} Opa tranquilo?`)
        await consoleServer.send(`${message.author} Me mencionou no canal ${message.channel}`)
      }
      else if(message.mentions.members.first().id == '334359138110799872'){
        //await message.channel.send(`${message.author} Já avisei ele, daqui a pouco ele aparece.`)
        await message.mentions.members.first().send(`${message.author} Te chamou no canal ${message.channel}`)
      }
    }
    else{
      return 
    }
  }
  //autenticação 
  if (comando == 'login'){
    try{
    const busca = await message.fetch("login")
    busca.delete()
    let server = message.guild.id
    const cargo = args[0]
    const senha = args[1]

    if(server != '343227251501957121'){
      erro.setDescription('Você está tentando logar fora do servidor Oficial')
      envio = await message.channel.send(erro)
      setTimeout(() =>  envio.delete(),3000)
     
    }
    else if(!cargo){
      const logado = ['✅','✅','✅']
      if(!message.member.roles.cache.has('423629707762728970')){
        logado[0] = '❌'
      }
      if(!message.member.roles.cache.has('750434798870462626')){
        logado[1] = '❌'
      }
      if(!message.member.roles.cache.has('481485196462522388')){
        logado[2] = '❌'
      }
      const login = new MessageEmbed()
            .setAuthor(message.guild.name,message.guild.iconURL(),'https://discord.gg/RXNTwcW')
            .setColor(Cor)
            .setTimestamp()
            .setThumbnail(message.author.avatarURL())
            .addFields(
              { name: 'Membro', value: logado[0],inline: true},
              { name: 'Byte', value: logado[1], inline: true },
              { name: 'Estudante', value: logado[2], inline: true },
            )
      
      await message.channel.send(login)
    }
    if(cargo == 'membro'){
      const embedMembro = new MessageEmbed()
      .setTitle(`:white_check_mark: Logado como ${cargo}`)
      .setColor(Cor)
      .setTimestamp()
      .setThumbnail('https://cdn.discordapp.com/attachments/425141386266935296/782306680759124028/icone.png')
      await message.member.roles.add("423629707762728970")
      const envio = await message.channel.send(embedMembro)
      setTimeout(() =>  envio.delete(),5000)
  
    }
    if(cargo == 'byte'){
      if(senha == 'olaph'){
        const embedMembro = new MessageEmbed()
        .setTitle(`:white_check_mark: Logado como ${cargo}`)
        .setColor(Cor)
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/714573856613859339/789222134853271603/byte.png')
        await message.member.roles.add("750434798870462626")
        const envio = await message.channel.send(embedMembro)
        setTimeout(() =>  envio.delete(),5000)
      }
      else{
        await message.channel.send(`:x: **Acesso negado!**`)
      }
    }
    if(cargo == 'estudante'){
      if(senha == '5725'){
        const embedMembro = new MessageEmbed()
        .setTitle(`:white_check_mark: Logado como ${cargo}`)
        .setColor(Cor)
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/425141386266935296/435928628908523520/book_stack_pc_1600_clr_3258.png')
        await message.member.roles.add("481485196462522388")
        const envio = await message.channel.send(embedMembro)
        setTimeout(() =>  envio.delete(),5000)
      }
      else{
        await message.channel.send(`:x: **Acesso negado!**`)
      }
    }
  }
  catch{
    erro.setDescription('Não foi possivel fazer login')
    await message.author.send(erro);
    console.error()
  }
  }
  //comandos prontos
  if(comando == "info"){
    try{
      const busca = await message.fetch("")
      busca.delete()
      const terminal = client.channels.cache.get("392697933562118144");
      const jarvis = message.guild.members.cache.get('703636663473274962') ;
      
      if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
        try{
          const info = new MessageEmbed()
          .setTitle('Informações do Servidor')
          .setColor(Cor)
          .setDescription('\n \n :key: **AUTENTICAÇÃO** \n \n '+
          '   :one:   **Membro**    -   (Aberto) \n   :two:  **Byte**    -   (requer senha) \n   :three:  **Estudante**    -   (requer senha) \n \n' +
          `:white_small_square: Voce pode solicitar as senhas no privado do ${jarvis}` +
          `\n :white_small_square:   Use o comando **.login cargo senha** em ${terminal} para fazer o login` + 
          '\n \n <a:ironman:813444818444877884>\n \n'+
          `:white_small_square: Convite do [@J-A-R-V-I-S](https://discord.com/oauth2/authorize?=&client_id=703636663473274962&scope=bot&permissions=8) \n `+
          `:white_small_square: <a:globo:813455999847366687> Site do servidor : http://thelopes.glitch.me \n`+
          `:white_small_square: <:covil:781190450488934432> Convite do servidor    :      https://discord.gg/RXNTwcW`)
          
          .setImage('https://cdn.discordapp.com/attachments/392710044845604865/781181286122389504/info.png')
          .setFooter('Qualquer duvida entrar em contato com a Equipe Jarvis')
          .setURL('https://discord.gg/RXNTwcW')
          .setTimestamp()
          await message.channel.send(info)
          
        }
        catch{
          erro.setDescription("Não foi possivel enviar a mensagem!")
          await message.author.send(erro)
        }
      
      }
      
    }
    catch{
      erro.setDescription('Não foi possivel enviar a mensagem')
      await message.author.send(erro);
      console.error()
      }
    
  }
  if(comando == "regras"){
    try{
      const busca = await message.fetch("")
      busca.delete()
      const info = client.channels.cache.get("392710044845604865");
      
      const regras = new MessageEmbed()
      .setTitle('Respeite as regras')
      .setColor(Cor)
      .setDescription(
      '🔸 Aqui é um grupo para todo tipo de pessoa, portanto respeite o jeito de cada um. \n \n' +
      '🔸 Proibido postar de uma forma repetida (spam) ou em sequência (flood). (Essa regra é aplicada para palavras, emoji ou imagens). \n \n'+
      '🔸 Cada canal tem sua singularidade então RESPEITE! \n \n'+
      '🔸 Proibido ser x9, levar algo do servidor para fora. \n \n'+
      '🔸 Proibido divulgar links e servidores nos canais ou no DM dos usuários, caso visto ou reportado haverá punição. \n \n \n' +
      `Para mais informações passe no canal ${info}`)
      .setThumbnail('https://cdn.discordapp.com/attachments/714573856613859339/814543708997025822/boneco.gif')
      .setURL('https://discord.gg/RXNTwcW')
      .setImage('https://cdn.discordapp.com/attachments/714573856613859339/820067258742734878/regras.png')
      .setFooter('Qualquer duvida entrar em contato com a Equipe Jarvis')
      await message.channel.send(regras)

    }
    catch{
      erro.setDescription("Não foi possivel enviar as regras!")
      await message.author.send(erro)
    }
  }
  //sistema de fala
  if (comando == "falar"){
    try{
    const busca = await message.fetch("")
    busca.delete()
    let id = args[0]
    let mensagem = args.slice(1).join(' ')
    let canal = client.channels.cache.get(id);
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      try{
        await canal.send(mensagem)
        consoleServer.send(`<${mensagem}> enviada para ${canal}`)}
      catch{
        erro.setDescription("Não foi possivel enviar a mensagem!")
        await message.author.send(erro)
      }
    }
  }catch{
    erro.setDescription('Não foi possivel enviar a mensagem')
    await message.author.send(erro);
    console.error()
  }
  }
  if(comando == "editar" || comando == "excluir"){
    try{
      const busca = await message.fetch()
      busca.delete()
      const canal = await  client.channels.cache.get(args[0])
      const msg = await canal.messages.fetch(args[1])
      msgNew = args.slice(2).join(' ')
      if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      if(msgNew){
        try{
          msg.edit(msgNew)
          consoleServer.send(`<**${msg.content}**> Foi editada para <**${msgNew}**>`)
        }
        catch{
          erro.setDescription('Erro ao editar a mensagem')
          message.author.send(erro)
        }
      }
      else{
        try{
          msg.delete()
          consoleServer.send(`<**${msg.content}**> Deletada`)
        }
        catch{
          erro.setDescription('Erro ao deletar a mensagem')
          message.author.send(erro)
        }
      }
    }
    else{
      erro.setDescription('Sem permissão')
      message.author.send(erro)
    }
    }catch{
      erro.setDescription('Não foi possivel editar/deletar a mensagem')
      message.author.send(erro)
      console.error()
    }
    
  }
  if(comando == "avisar"){
    try{
    const busca = await message.fetch("avisar")
    busca.delete()
    let avisos = client.channels.cache.get("392711722172940298");
    const mensagem = args.join(" ");
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      try{
          await avisos.send(mensagem)
          consoleServer.send(":white_check_mark:  mensagem enviada com sucesso!")}
      catch{
         erro.setDescription('Não foi possivel enviar a mensagem')
         await message.author.send(erro);
      }
      
    }
    else{
      erro.setDescription('Você não tem permissão')
      await message.author.send(erro);
    }
    }catch{
      erro.setDescription('Não foi possivel enviar a mensagem')
      await message.author.send(erro);
      console.error()
    }
  }
  if(comando == "alertar"){
    try{
    const busca = await message.fetch()
    busca.delete()
    let alertas = client.channels.cache.get("781170727151206420");
    const mensagem = args.join(" ");
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      try{
          await alertas.send(mensagem)
          consoleServer.send(":white_check_mark:  mensagem enviada com sucesso!")}
      catch{
         erro.setDescription('Não foi possivel enviar a mensagem')
         await message.author.send(erro);
      }
      
    }
    else{
      erro.setDescription('Você não tem permissão')
      await message.author.send(erro);
    }
    }catch{
      erro.setDescription('Não foi possivel enviar a mensagem')
      await message.author.send(erro);
      console.error()
    }
  }
  if(message.channel.type == "dm"){
    try{
      try{
        arquivo = message.channel.lastMessage.attachments.map(c => c.url)
  
        if(arquivo.length == 1){
          const link = message.channel.lastMessage.attachments.map(c => c.url)
          const arquivo = new MessageAttachment(link[0])
          const msg = `O membro **${message.author}** enviou um arquivo:`
          await consoleServer.send(msg)
          await consoleServer.send(arquivo) 
          return
        }
        
        const msg = `O membro **${message.author}** respondeu: \n ${message.content}`
        await consoleServer.send(msg)}
      catch{
        erro.setDescription('Foi identificado uma mensagem no DM, porem não consegui enviar pro console.')
        await consoleServer.send(erro);
        
      }
  }catch{
    console.error()
  }
  }
  if(comando == "privado"){
    try{
    const busca = await message.fetch("privado")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872" || message.author.id == "703636663473274962"){
      let membro = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      let mensagem = args.slice(1).join(' ')
      if(!membro)return await message.channel.send("Você não informou um membro!");
      if(!mensagem)return await message.channel.send("Você não informou uma mensagem!");
      try{
        await membro.send(mensagem)
        await consoleServer.send(`:white_check_mark: mensagem enviada com sucesso para ${membro}!`)
        }
      catch{
         erro.setDescription('Não foi possivel enviar a mensagem')
         await message.author.send(erro);
        }
        }
    }catch{
      erro.setDescription('Não foi possivel enviar a mensagem')
      await message.author.send(erro);
      console.error()
    }
  }
  if(comando == "arquivo"){
    try{
      const busca = await message.fetch()
      busca.delete()
      if(!args[0])return message.channel.send('Não informou o canal ou o membro')
      const canal = client.channels.cache.get(args[0]) || message.mentions.members.first() || message.guild.members.cache.get(args[0])
      const envio = await message.channel.send('Envie o arquivo')
      const cap = setInterval(() => {
        const arquivoInput = message.channel.lastMessage.attachments
        const arquivoOuput = arquivoInput.map(name => name.url)
        if(arquivoOuput[0]){
          const arquivo = new MessageAttachment(arquivoOuput[0])
          canal.send(arquivo)
          message.channel.bulkDelete(1)
          envio.edit('✅ arquivo enviado')
          clearInterval(cap)
        }
        
      },1000)
      setTimeout(() => {
        if(cap._destroyed == false){
          envio.edit(':x: Tempo expirado')
          clearInterval(cap)
                                  } 
        },30000)
    }
    catch{
      erro.setDescription('Não foi possivel enviar o arquivo')
      await message.author.send(erro);
      console.error()
    }
  }
  if(comando =="time"){
    try{
    const busca = await message.fetch("time")
    busca.delete()
    let time = args[0]
    let tempo = time * 1000 * 60
    let id = args[1]
    let mensagem = args.slice(2).join(' ')
    let canal = client.channels.cache.get(id);
    try{
    await consoleServer.send(`:clock2: Sera enviado **${mensagem}** no canal ${canal} daqui a ${time} minutos.`)
    setTimeout(()=> canal.send(mensagem),tempo)
    }
    catch{
        erro.setDescription('Não foi possivel enviar a mensagem')
         await message.author.send(erro);
    }
    }catch{
      erro.setDescription('Não foi possivel enviar a mensagem')
      await message.author.send(erro);
      console.error()
  }
  }
  
  if(comando == "noticia"){
    try{
      const busca = await message.fetch("noticia")
      busca.delete()
      if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
        const imagem = args[0]
        const fonte = args[1]
        let texto = args.slice(2).join(' ')
        let canal = client.channels.cache.get('804189572321378325')//("714572433822187571")
        if(!imagem || !fonte || !texto)return await message.channel.send('Noticia Não passou nas validações')
        const noticia = new MessageEmbed()
        .setTitle(texto)
        .setFooter('Fonte: '+ fonte)
        .setColor(Cor)
        .setImage(imagem)
        .setTimestamp()
        if(fonte.includes('https:')){
          noticia.setURL(fonte)
        }
        const confirm = await message.channel.send(noticia)
          const timer = setInterval(() => {
            console.log(message.channel.lastMessage.content)
            if(message.channel.lastMessage.content == 'd'){
              setTimeout(() => {
                noticia.setDescription(message.channel.lastMessage.content)
              },1000)
              
          }
            if(message.channel.lastMessage.content == 'enviar'){
                message.channel.lastMessage.delete()
                confirm.delete()
                canal.send(noticia)
                clearInterval(timer)
            }
            else if(message.channel.lastMessage.content[0] == '@' || message.channel.lastMessage.content[1] == '@'){
                message.channel.lastMessage.delete()
                confirm.delete()
                canal.send(message.channel.lastMessage.content)
                canal.send(noticia)
                clearInterval(timer)
              }
          },1000)
          setTimeout(()=> {
            if(timer._destroyed == false){
              clearInterval(timer)
              confirm.edit(':x: O tempo para enviar a noticia experiou')
            }
            else{
              consoleServer.send(":incoming_envelope: Noticia postada com sucesso!")
            }  
          },60000)
        
    }
    }catch{
      erro.setDescription('Não foi possivel enviar a noticia')
      await message.author.send(erro);
   } 
  }
  if(comando =="foto"){
    try{
    const busca = await message.fetch("foto")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    let link = args[0]
    let mensagem = args.slice(3).join(' ')
    if(!mensagem){
       mensagem = ``
    }
    let canal = client.channels.cache.get(args[1]) || message.mentions.members.first() || message.guild.members.cache.get(args[1])
    try{
        await canal.send(mensagem, { files: [link] })
        await consoleServer.send(" :white_check_mark: Foto enviada com sucesso!")
      }
    catch{
        erro.setDescription(`Erro no envio da foto para ${canal}`)
        await message.author.send(erro);
      }
   
    
    }
    }catch{
      erro.setDescription('Erro ao enviar a foto')
      await message.author.send(erro);
      console.error()
    }
  }
  if (comando == "aqui"){
    try{
    const busca = await message.fetch("aqui")
    busca.delete()
    let servidores = db.get('servidores').value()
    const voz =  message.member.voice.channel
    if(!voz){
        erro.setDescription('Você não está conectado a nenhuma chamada')
        const envio = await message.channel.send(erro)
        setTimeout(()=> envio.delete(),3000)
        return
    }
    const convite = new MessageEmbed()
          .setTitle(message.author.username)
          .setColor(Cor)
          .setThumbnail(message.author.avatarURL())
          .setAuthor(`${message.guild.name} | ${voz.name}`, message.guild.iconURL())
          .setDescription(' \n \n [Ver](https://discordapp.com/channels/'+ message.guild.id +'/'+ voz.id +')')
          .setFooter('Para ver a chamada você precisa está conectado')
          .setTimestamp()
    for (var i = 0; i < servidores.length; i++){
        let objeto = servidores[i]
        let chave = Object.keys(objeto)
        const indicie = chave.indexOf('canal')
        if(chave[indicie] == 'canal'){
            let canal = client.channels.cache.get(objeto[chave[indicie]])
            canal.send(convite)
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
      const mensagem = args.join(' ')
      try{
        await message.channel.send(`:slight_smile: ${message.author} Opa beleza ?`);
        await consoleServer.send(` Mensagem: **${mensagem}** \n Author: **${message.author}**`)
        }
      catch{
        await message.channel.send(":yawning_face: Não entendi nada!")
      }
    }catch{
      erro.setDescription('Alguem me chamou e eu fiquei nervoso de mais')
      await consoleServer.send(erro);
      console.error()
    }
  }
///////////Banco de Dados////////////////
  if(comando == "database"){
    try{
      const busca = await message.fetch("jarvis")
      busca.delete()
      if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872" || message.guild.id == '730069592030052376'){
        const arquivo = new MessageAttachment('banco.json')
        await message.author.send(arquivo)
      }
      else{
        await message.channel.send('Você não está autorizado para ter acesso ao meu banco de dados, me chame no privado pra gente conversar melhor!')
      }
      
    }
    catch{
      erro.setDescription("não foi possivel enviar o banco de dados")
      await message.author.send(erro)
    
    }
  }
  if(comando == 'newbiblioteca'){
    try{
      const busca = await message.fetch("biblioteca")
      busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      try{
          const biblioteca = args[0]
          db.set(biblioteca, []).write()
          await message.channel.send(`:white_check_mark: Biblioteca **${biblioteca}** Criada com sucesso!`)}
      catch{
        erro.setDescription('Erro ao criar biblioteca')
        await message.author.send(erro)
      }
    }
    else{
      erro.setDescription('Sem permissão')
      await message.channel.send(erro)
    }
    }catch{
      console.error()
    }
  }
  if(comando == 'newitem'){
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
       await message.channel.send(`:white_check_mark: **${nome}** adicionado a biblioteca ${biblioteca} com sucesso!`)}
      catch{
        erro.setDescription('Erro ao criar item')
        await message.author.send(erro)
      }
  }catch{
    console.error()
  }
  }
  if(comando == 'newchave' || comando == 'editchave'){
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
        await message.channel.send(`:white_check_mark: chave ${chave} foi adicionada com sucesso!.`)  
        }
    catch{
      erro.setDescription('Erro ao adicionar chave.')
      await message.author.send(erro)
    }
  }catch{
    console.error()
  }
  }
  if(comando == 'delitem'){
    try{
    const busca = await message.fetch("")
    busca.delete()
    const biblioteca = args[0]
    const item = args[1]
    if(!biblioteca)return message.channel.send('Você não informou a biblioteca.')
    if(!item)return message.channel.send('Você não informou o item.')

    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      db.get(biblioteca).remove({id: item}).write()
      await message.channel.send(':white_check_mark: Item deletado com sucesso!')
    }
    else{
      erro.setDescription('Você não tem permissão')
      await message.author.send(erro)
    }
  }catch{
    console.error()
  }
 }
  if(comando == 'acessar'){
    try{
    const busca = await message.fetch("")
    busca.delete()
    const biblioteca = args[0]
    const item = args[1]
    const especificaçao = args[2]
    if(!item){
      if(!biblioteca){
        erro.setDescription('Não informou a biblioteca')
        const envio = message.channel.send(erro)
        setTimeout(()=> envio.delete(),3000)}
      try{
        let document = db.get(biblioteca).value()
        let msg = ''
        for (var i = 0; i < document.length; i++){
          let objeto2 = document[i]
          let chave2 = Object.keys(objeto2)
          if(biblioteca == 'servidores'){
            msg = msg + objeto2[chave2[1]] + '\n'
          }
          else{
            msg = msg + objeto2[chave2[0]] + '\n'
          }
        }
        if(biblioteca == 'servidores'){
          embedBiblioteca = new MessageEmbed()
          .setTitle("Servidores")
          .setColor(Cor)
          .setTimestamp()
          .setDescription(msg)
          .setThumbnail('https://cdn.discordapp.com/attachments/714573856613859339/789255087004057671/discord.jpg')
        }
        else if(biblioteca == 'documentação'){
          embedBiblioteca = new MessageEmbed()
          .setTitle("Documentação")
          .setColor(Cor)
          .setDescription(msg)
          .setThumbnail('https://cdn.discordapp.com/attachments/425141386266935296/435928628908523520/book_stack_pc_1600_clr_3258.png')
        }
        else{
          embedBiblioteca = new MessageEmbed()
          .setTitle("Repositorios")
          .setColor(Cor)
          .setTimestamp()
          .setDescription(msg)
          .setThumbnail('https://cdn.discordapp.com/attachments/714573856613859339/789255085166428200/github.png')
        }
        
        await message.channel.send(embedBiblioteca)
      }
      catch{
        erro.setDescription('Erro ao achar biblioteca informada')
        const envio = await message.channel.send(erro)
        setTimeout(()=> envio.delete(),3000)
      }
    }
    else{
      try{
      let objeto = db.get(biblioteca).find({id: item}).value()
      let chave = Object.keys(objeto)
      for (var i = 0; i < chave.length; i++) {
        if(!especificaçao){
          if(chave[i] == 'valor'){
            if(biblioteca == 'repositorios'){
              embedItem = new MessageEmbed()
              .setTitle(item)
              .setColor(Cor)
              .setThumbnail('https://cdn.discordapp.com/attachments/714573856613859339/789255085166428200/github.png')
              .setURL(objeto[chave[i]])
              .setDescription('[download](' + objeto[chave[i]] +'/archive/master.zip)')
              await message.channel.send(embedItem)
            }
            else if (biblioteca == 'documentação'){
              embedItem = new MessageEmbed()
              .setTitle(item)
              .setColor(Cor)
              .setThumbnail('https://cdn.discordapp.com/attachments/425141386266935296/435928628908523520/book_stack_pc_1600_clr_3258.png')
              .setURL(objeto[chave[i]])
              await message.channel.send(embedItem)
            }
            else{
              embedItem = new MessageEmbed()
              .setTitle(item)
              .setColor(Cor)
              .setURL(objeto[chave[i]])
              await message.channel.send(embedItem)
            }
            }
          if(chave[i] == 'nome'){
            try{
              const servidor =  client.guilds.cache.get(item)
              const convite = objeto['convite']
              const erro = [,convite]
              if(servidor.afkChannel != null){
                    erro[0] = servidor.afkChannel.name
                  }
              else{
                 erro[0] = 'null'
              }
              if(convite){
                    erro[1] = convite 
                  }
              else{
                erro[1] = "https://cdn.discordapp.com/attachments/714573856613859339/789875127570399292/mensagem_de_erro.png"
              }
              embedServer = new MessageEmbed()
                .setTimestamp()
                .setColor(Cor)
                .setThumbnail(servidor.iconURL())
                .setFooter('Covil', 'https://cdn.discordapp.com/attachments/425141386266935296/782306680759124028/icone.png')
                .addFields(
                  { name: 'Membros', value: `${servidor.members.cache.size}`,inline: true},
                  { name: 'Canais', value: `${servidor.channels.cache.size}`,inline: true},
                  { name: 'Dono', value: `${servidor.owner.user.username}`,inline: true},
                  { name: 'AFK', value: erro[0],inline: true},
                  { name: 'Moderação', value: `${servidor.verificationLevel}`,inline: true},
                  { name: 'Região', value: `${servidor.region}`,inline: true})
                .setAuthor(servidor.name, servidor.iconURL(), erro[1])
                await message.channel.send(embedServer) 
              }
            catch{
              console.error()
            }
          }  
        }
        else{
          if(chave[i]== especificaçao){
            embedItem = new MessageEmbed()
              .setTitle(objeto[chave[i]])
              .setColor(Cor)
              .setFooter('Achamos melhor mandar dados especifos no privado')
            message.author.send(embedItem)
          }
        }
      }
    }
       catch{
         erro.setDescription('Erro ao acessar o item')
        const envio = await message.channel.send(erro)
        setTimeout(()=> envio.delete(),3000)
       }
    }
  }catch{
    console.error()
  }
  }
////////////////////////////////////////

//cargos 
  if(comando == "newcargo"){
    try{
        const busca = await message.fetch("newcargo")
        busca.delete()
        let nome = args[0]
        if(!nome)return message.channel.send(':x: Não informou o nome do cargo.')
          try{
            if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
            await message.guild.roles.create({ data: {
            name: nome,
            },})
            await message.channel.send(':white_check_mark: Cargo criado com sucesso! ')
          }
          else{
            erro.setDescription('Você não tem permissão')
            await message.author.send(erro)
          }
           }
          catch{
            erro.setDescription('Erro ao criar o novo cargo')
            await message.author.send(erro)
    
          }
    }catch{
      console.error()
    }
  }
  if(comando == "delcargo"){
    try{
      const busca = await message.fetch("excargo")
      busca.delete()
      try{
        if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
        const cargo = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.roles;
        cargo.delete()
        const confirmar = await message.channel.send(":white_check_mark: Cargo deletado com sucesso!")
        }
        else{
        erro.setDescription('Você não tem permissão')
        await message.author.send(erro)
      }
      }
      catch{
        erro.setDescription('Erro ao deletar o cargo')
      await message.author.send(erro)
        
      }
    }catch{
      console.error()
    }
  }
 
//sistema de verificação
  if(comando == "status"){
    try{
    const busca = await message.fetch("status")
    busca.delete()
    const servidores = client.guilds.cache.map(a =>`${a.name}` )
    if(args[0]== 'servidores' ){
      if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
          await message.channel.send(`**Servidores cadastrados: ** ${servidores}`)
          client.channels.cache.map(a =>  message.author.send(`${a.name} : ${a.id}\n`))
      }
      else{
        erro.setDescription('Você não tem permissão')
        await message.author.send(erro)
      }
    }
    else{
      const status = new MessageEmbed()
      .setThumbnail('https://cdn.discordapp.com/attachments/714573856613859339/805109196714016779/jarvis-secret.gif')
      .setColor(Cor)
      .setTimestamp()
      .addFields(
        { name: 'Usuarios', value: `${client.users.cache.size}`,inline: true},
        { name: 'Servidores', value: `${client.guilds.cache.size}`,inline: true},   
        { name: 'Canais', value: `${client.channels.cache.size}`,inline: true},
        {name: `<a:status:813454757506842705>`, value: '[Home](https://discord.gg/RXNTwcW)'}
        
        )
      .setFooter('Hospedado em https://discloudbot.com')
      await message.channel.send(status);
      
  }
  }catch{
    console.error('erro')
  }
  }
  if(comando == "verificar"){
    try{
    const busca = await message.fetch("verificar")
    busca.delete()
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    try{
      const statusList = ['Online','Ausente','Ocupado','Offline']
      const stateList = ['online','idle','dnd','offline']
      let indice = stateList.indexOf(member.presence.status)
      const status = new MessageEmbed()
          .setTitle(`${member.user.username}`)
          .setDescription(statusList[indice])
          .setColor(Cor)
          .setThumbnail(member.user.avatarURL())
          .setTimestamp()
      await message.channel.send(status)
    }
    catch{
      erro.setDescription('Erro ao verificar membro')
      await message.channel.send(erro)
    }
    
  }catch{
    console.error()
  }
  }
  if(comando == "mostrar"){
    try{
    const busca = await message.fetch("mostrar")
    busca.delete()
    const tipo = args[0]
    const nome = args[1]
    membro = message.mentions.members.first() || message.guild.members.cache.get(args[2]) || message.member;
    const dados = new MessageEmbed()
        .setColor(Cor)
        .setTimestamp()
    if(!tipo){
      erro.setDescription('Busca invalida')
      const envio = await message.channel.send(erro)
      setTimeout(() => envio.delete(),3000)
    }
    else if(tipo == "dono"){
      dados.setTitle(`${message.guild.owner.user.username}`)
      dados.setDescription(`${message.guild.name}`)
      dados.setThumbnail(message.guild.owner.user.avatarURL())
  
      await message.channel.send(dados)
    }
    else if(tipo == "data"){
        if(!nome){
          erro.setDescription('Busca invalida. Não informou o nome')
          const envio = await message.channel.send(erro)
          setTimeout(()=> envio.delete(),3000)
        }
        if(nome == "canal"){
          const id = args[2]
          if(!id){
            erro.setDescription('Tentativa invalida. você não informou o ID.')
            const envio = await message.channel.send(erro)
            setTimeout(()=> envio.delete(),3000)
          }
    
          const canal =  client.channels.cache.get(id);
          const dados =  canal.createdAt
          let data = dados.toLocaleDateString()
          await message.channel.send(`${canal} foi criado em **${data}**`)

        }
        if(nome =="membro"){
          const dados = membro.user.createdAt
          let data = dados.toLocaleDateString()
          await message.channel.send(`O membro ${membro} entrou no discord em **${data}**`)
        }
      }
    else if(tipo == "canal"){
        if(!nome)return message.channel.send(`${message.author} Busca invalida!`)
        if(nome == "lista"){
          const lista = await message.guild.channels.cache.map((i) => i.name);
          dados.setTitle('📜Lista de canais')
          dados.setDescription(lista)
          await message.channel.send(dados)
        }
        else{
          try{
            let channel = message.guild.channels.cache.find(c => c.name == nome);
            await message.channel.send(`${message.author} Encontrei canal com esse nome. \n ID: ${channel.id}`)
          }
          catch{
            const channelServer = client.channels.cache.map(c => {
                if(c.name == nome){
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
                await message.channel.send('Esse canal não faz parte do meu sistema.')
              }
              else{
                await message.channel.send(`${message.author} Encontrei seu canal em outro servidor. \n ID: ${channelServer}`)
              }
          }
        }
    }
  }catch{
    console.error()
  }
  }
  //salas

  if(comando == "salaconnect"){
   try{
    const busca = await message.fetch()
    busca.delete()
    try{
      if(!args[0]){
        erro.setDescription('Você precisa da chave de acesso!')
        const envio = await message.channel.send(erro)
        setTimeout(() => envio.delete(), 3000 )
        return 
      }
      else if(args[0] != sala.chave){
        erro.setDescription('Chave de acesso invalida!')
        const envio = await message.channel.send(erro)
        setTimeout(() => envio.delete(), 3000 )
        return
      }
      else if(message.member.roles.cache.has(sala.cargo)){
        return
      }
      await message.member.roles.add(sala.cargo)
      let salaDiscord = message.guild.channels.cache.find(c => c.name == "💬chat");
      salaDiscord.send(`${message.author} entrou na sala`)
      const convite = new MessageEmbed()
      .setTitle('Sala liberada para ' + message.author.tag)
      .setColor(Cor)
      .setDescription(' \n \n [Ir para sala](https://discordapp.com/channels/'+ message.guild.id +'/'+ salaDiscord.id +')')
      .setFooter('Essa sala pode ser fechada usando o comando  .delsala ')
      await message.channel.send(convite)
   }
    catch{
      erro.setDescription('Erro ao entrar na sala')
      await message.author.send(erro)
    } 
    }catch{
    console.error()
  }
    }
  if(comando == "sala"){
    try{
    const busca = await message.fetch("sala")
    busca.delete()
    try{
      if(sala.aberta == true){
        message.channel.send(`Já existe uma sala, peça a chave de acesso para ${sala.dono}`)
        return
        }
      const cargo = await message.guild.roles.create({ data: {
        name: '🎮sala',
        },})
      await message.guild.channels.create("🎮SALA", {
        type: 'category',
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: cargo.id,
            allow: ['VIEW_CHANNEL'],
          },
        ]}
        ).catch(console.error);
      const categoria = await message.guild.channels.cache.find(c => c.name == "🎮SALA"); 
      const canal = await message.guild.channels.create("💬chat", {type: "text" , parent: categoria.id }).catch(console.error);
      await message.guild.channels.create("🔊CHAMADA", {type: "voice" , parent: categoria.id }).catch(console.error);
      const convite = new MessageEmbed()
      .setTitle(':white_check_mark: Sala criada!')
      .setColor(Cor)
      .setDescription(' \n Chave da sala : '+ canal.id)
      .setTimestamp()
      await message.member.roles.add(cargo.id)
      await canal.send(convite)
      sala.aberta = true
      sala.dono = message.author.tag
      sala.chave = canal.id
      sala.cargo = cargo.id
   }
    catch{
     erro.setDescription('Erro ao criar sala')
      await message.author.send(erro)
    }  
    }catch{
    console.error()
  }
    }
  if(comando =="delsala"){
    try{
    const busca = await message.fetch()
    busca.delete()
    try{
      let categoria = message.guild.channels.cache.find(c => c.name == "🎮SALA");
      let text = message.guild.channels.cache.find(c => c.name == "💬chat");
      let voice = message.guild.channels.cache.find(c => c.name == "🔊CHAMADA");
      let cargo = message.guild.roles.cache.get(sala.cargo)
      
        await categoria.delete()
        await text.delete()
        await voice.delete()
        await cargo.delete()
        sala.aberta = false
        await message.author.send(":white_check_mark: Sala Deletada")
      
    }
    catch{
      erro.setDescription('Erro ao deletar sala')
      await message.author.send(erro)
  }
  }catch{
  console.error()
  }
  }
  //moderação
  if(comando == "delchannel"){
    try{
    let id = args.join(" ")
    let canal = client.channels.cache.get(id);
   
    const busca = await message.fetch("delchannel")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      if(!id){
        erro.setDescription('Não enviou nenhum ID para eu apagar!')
        envio = await message.channel.send(erro)
        setTimeout(() => envio.delete(),3000)
       
          }
      else{
        try{
          await canal.delete()
          await message.channel.send(':white_check_mark: Canal deletado!')
      }
      catch{
        erro.setDescription('Erro ao apagar canal.')
        await message.author.send(erro)
      }
    }
    }
    else{
      erro.setDescription('Sem permissão')
      envio = await message.author.send(erro)
    
    }
    }catch{
      console.error()
    }
  }
  if(comando == "newchannel"){
    try{
    const busca = await message.fetch("newchannel")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      let nome = args[0]
      let tipo = args[1]
      let categoria = args[2]
  
      if(!nome){
        erro.setDescription('Tentativa invalida. você não informou o nome.')
        const envio = await message.channel.send(erro)
        setTimeout(()=> envio.delete(),3000)
      }
      else{
        try{
          await message.guild.channels.create(nome, {type: tipo, parent: categoria})
          await message.channel.send(":white_check_mark: Canal criado com sucesso!")
        }
        catch{
          erro.setDescription('Erro ao criar canal')
          await message.author.send(erro)
        }
      }
    }
  }catch{
    console.error()
  }
  }
  if (comando == "kick"){
    try{
    const busca = await message.fetch("kick")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      const membro = message.mentions.members.first()
      try{
       await membro.kick()
       await message.channel.send(':white_check_mark: Membro expulso com sucesso!')
      }
      catch{
        erro.setDescription('Erro ao expulsar membro')
        await message.author.send(erro)
      }
    }
    else{
      erro.setDescription('Não recebo ordens de você')
      const envio = await message.channel.send(erro)
      setTimeout(() => envio.delete(), 3000 )
       
    }
  }catch{
    console.error()
  }
  }
  if(comando == "delete"){
    try{
    const busca = await message.fetch("delete")
    busca.delete()
    let qt = args[0]
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      if(!qt){
        erro.setDescription('Não me informou quantas mensagens devo apagar!')
        const envio = await message.channel.send(erro)
        setTimeout(()=> envio.delete(),3000)
      }
    else{
      try{
        setTimeout(() => {message.channel.bulkDelete(qt);}, 500);
      }
      catch{
        erro.setDescription('Erro ao deletar mensagem')
        await message.author.send(erro)
      }
    }
  }
  }catch{
    erro.setDescription('Erro ao deletar mensagem')
    await message.author.send(erro)
    console.error()
  }
  }
  if(comando == "state"){
    try{
    const busca = await message.fetch("state")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    if (args[0] == 'reset'){
      consoleServer.send('Status resetado!')
      client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
    }
    else{
    const status = args.join(' ')
    client.user.setActivity(status, { type: 'PLAYING' })
    consoleServer.send('Status Alterado!')
    .catch(console.error);
    }
    }
  }catch{
      console.error()
    }
  } 
  //Codigo desenvolvido para o servidor Byte jr.
  
  if(comando =="tabela" || comando == "curso" || comando == "plataforma" || comando == "c" || comando == "ativar" || comando == "desativar"){
    try{
     
    const command = client.channels.cache.get('815014553666453515')
      if(message.guild.id != '730069592030052376')return
      if(message.member.roles.cache.has("782232736332251156")){
        message.reply('Sistema privado para membros da byte')
        return
      }
      if(message.channel.id != '815014553666453515'){
        const busca1 = await message.fetch("")
        busca1.delete()
        const envio = await message.channel.send(`Vá para o canal ${command}`)
        envio.delete({timeout: 5000})
        return
    }
    
    const data = new Date()
    data.setHours(parseInt(data.getHours() - 3))
   
    let hora = ""
    if(data.getHours() < 10){
      hora = '0'+ data.getHours() + ':' + data.getMinutes()
    }
    else{
      hora = data.getHours() + ':' + data.getMinutes()
    }
      const busca = await message.fetch("")
      busca.delete()
      if(!args[0]){
        //busca.react('<a:carta:814308606711037994>')
        if(comando == "ativar" || comando == "desativar")return
        const curso = db.get('byte').value()
        
        const tabela = new MessageEmbed()
        .setTitle("<a:globo:813455999847366687> Tabela de cursos")
        .setColor('#47dd93')
        .setDescription(
        `:white_small_square: [B7](https://alunos.b7web.com.br/login)   ${curso[0].author}      ${curso[0].inicio}\n` +
        `:white_small_square: [ALURA](https://www.alura.com.br)         ${curso[1].author}      ${curso[1].inicio} \n`+
        `:white_small_square: [ORIGAMID](https://www.origamid.com)      ${curso[2].author}      ${curso[2].inicio} `
      )
        .setThumbnail('https://cdn.discordapp.com/attachments/777909174453141525/814168340423114873/Logo---Versao-Responsiva.png')
        .setImage('https://cdn.discordapp.com/attachments/777909174453141525/814173638679986217/backgrounCurso.png')
        .setFooter('Qualquer problema ou duvida entre em contato com TheLopes#5834')
        .setTimestamp()
        await message.channel.send(tabela)
        
        return
      }
      //let entrada = args[0]
      const plataforma = args[0].toUpperCase()
      const curso = db.get('byte').find({id: plataforma}).value()
      const day = data.getDate()

      if(day != curso.dia){
        db.get('byte').find({id: plataforma}).assign({ativo: 'false'},{author: "Não utilizada"},{inicio: ""},{authorID: ""}, {dia:""}).write()
      }  
      if(curso.ativo == 'false'){
        if(comando == "desativar"){
          await message.channel.send(`<a:status:813454757506842705> Plataforma já está desativada.`)
          return
        }
        await message.channel.send(`<a:status:813454757506842705> Plataforma ${plataforma} foi ativada em nome de ${message.member.displayName}`)
        db.get('byte').find({id: plataforma}).assign({ativo: 'true'},{author: message.member.displayName},{authorID: message.member.id},{inicio: hora}, {dia:day}).write()
        return 
        
      }

      let time = parseInt(curso.inicio.substr(0, 2))
      timeM = parseInt(curso.inicio.substr(3,2)) 
      time = parseInt(data.getHours()) - time

      timeM = parseInt(data.getMinutes()) - timeM
      if(timeM < 0){
        time = time -= 1
        timeM = timeM + 60
            }
      
      if(curso.ativo == 'true' && args[1] != 'force'){
        if(comando == "ativar"){
          await message.channel.send(`<a:status:813454757506842705> Plataforma já está ativa em nome de ${curso.author} com ${time} horas e ${timeM} minutos.`)
          return
        }
        if(curso.authorID == message.author.id){
          db.get('byte').find({id: plataforma}).assign({ativo: 'false'},{author: "Não utilizada"},{authorID:""},{inicio:""},{dia:""}).write()
          await message.channel.send(`<a:status:813454757506842705> Plataforma ${plataforma} foi desativada em nome de ${message.member.displayName} com ${time} horas e ${timeM} minutos.`)
          return
        }
        else{
          const member = message.guild.members.cache.get(curso.authorID)
          await member.send(`${message.author} tentou ativar a ${plataforma}, se você não estiver mais usando, por favor vá em um canal no servidor e use o comando **.desativar ${plataforma}**`)
          await message.channel.send(`<a:status:813454757506842705> A plataforma ${plataforma} está sendo usada por ${curso.author} á ${time} horas e ${timeM} minutos`)
        }
        
      }
      
      if(args[1] == 'force'){
        timeM = timeM /60 
        time = time + timeM
        if(time >= 2){
          const member = message.guild.members.cache.get(curso.authorID)
          await message.channel.send(`<a:status:813454757506842705> Plataforma ${plataforma} foi ativada em nome de ${message.member.displayName}`)
          await member.send(`${message.author} pegou seu acesso a ${plataforma} por está em seu nome a mais de 2 horas.`)
            db.get('byte').find({id: plataforma}).assign({ativo: 'true'},{author: message.member.displayName},{authorID: message.member.id},{inicio: hora}, {dia:day}).write()
          return
        }
        else{
          await message.reply(`Não é possivel usar o force pois ${curso.author} não ultrapassou as 2 horas minimas, está com com ${time} horas e ${timeM} minutos. \n *Nota: Foi enviado uma solicitação ao ${curso.author} pedindo o acesso.*`)
          const member = message.guild.members.cache.get(curso.authorID)
          await member.send(`${message.author} solicitou acesso a ${plataforma}, se você não estiver mais usando, por favor vá em um canal no servidor e use o comando **.desativar ${plataforma}**`)
          return
        }
        
      }
     
    }
    catch{
      erro.setDescription('Ocorreu um erro ao usar o sistema de controle de acesso aos cursos')
      await message.author.send(erro)
    }
  }
  if(comando == "b7" || comando == "alura" || comando == "origamid" || comando == "membros"){
    try{
      const busca = await message.fetch("")
      busca.delete()
      const command = client.channels.cache.get('815014553666453515')
      if(message.guild.id != '730069592030052376')return
      if(message.member.roles.cache.has("782232736332251156")){
        message.reply('Sistema privado para membros da byte')
        return
      }
      if(message.channel.id != '815014553666453515'){
        const busca1 = await message.fetch("")
        busca1.delete()
        const envio = await message.channel.send(`Vá para o canal ${command}`)
        envio.delete({timeout: 5000})
        return
    }
      const data = new Date()
      const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
    
      let entrada = comando
      let op = args[0]
      const name = args.slice(1).join(' ')//.replace(/,/g,'')
      const mes = meses[data.getMonth()]
      const colaboradores = db.get('byte').find({id: 'colaboradores'})
      const membros = colaboradores.value()[mes]

      if(comando === "membros"){
        let valor = ''
        if(op){
          op = op[0].toUpperCase() + op.substr(1);
          valor = op
        }
        else{
          valor = mes
        }
        let list = colaboradores.value()[valor]
        let texto = list.toString()
        let lista = texto.replace(/,/g, "\n :white_small_square: ")
        const tabela = new MessageEmbed()
        .setTitle(`<a:globo:813455999847366687> Membros do mes de ${valor}`)
        .setColor('#47dd93')
        .setDescription(
        `:white_small_square: ${lista}` 
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/777909174453141525/814168340423114873/Logo---Versao-Responsiva.png')
        .setFooter('Qualquer problema ou duvida entre em contato com TheLopes#5834')
        .setTimestamp()
        await message.channel.send(tabela)
        return
      }
      const plataforma = entrada.toUpperCase()
      const curso = db.get('byte').find({id: plataforma}).value()
      let lista = curso.cursos
      if(!op){
        
        const texto = lista.toString()
        let textoA = texto.replace(/,/g, "\n :white_small_square: ")
        
        const tabela = new MessageEmbed()
        .setTitle(`<a:globo:813455999847366687> Cursos da plataforma ${comando}`)
        .setColor('#47dd93')
        .setDescription(
        `:white_small_square: ${textoA}` 
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/777909174453141525/814168340423114873/Logo---Versao-Responsiva.png')
        .setFooter('Qualquer problema ou duvida entre em contato com TheLopes#5834')
        .setTimestamp()
        
        await message.channel.send(tabela)
      }
      else if(!name){
        erro.setDescription(`Não informou o nome do curso`)
        const envio = await message.channel.send(erro)
        envio.delete({timeout: 5000})
        return
      }
      else if(op == 'add'){
        lista.push(name)
        if(membros.indexOf(message.member.displayName) < 0){
          membros.push(message.member.displayName)
        }
        await db.get('byte').find({id: plataforma}).assign({cursos: lista}).write()
        await colaboradores.assign({[mes] : membros})
        await message.channel.send(`:white_check_mark: **${name}** adicionado com sucesso`)
        return
      }
      else if(op == 'remove'){
          if(lista.indexOf(name) < 0){
            erro.setDescription('Curso não encontrado')
            const envio = await message.channel.send(erro)
            envio.delete({timeout: 3000})
            return
          }
          lista.splice(lista.indexOf(name), 1)
          await db.get('byte').find({id: plataforma}).assign({cursos: lista}).write()
          await message.channel.send(`:white_check_mark: **${name}** removido com sucesso`)
          return
      }
      else{
        erro.setDescription(`Não informou os parametros corretamente`)
        const envio = await message.channel.send(erro)
        envio.delete({timeout: 3000})
        return
      }
      
    }
    catch{
      erro.setDescription('Erro inesperado')
      await message.author.send(erro)
    }
  }
  if(comando == "comandos" || comando == "ajuda" || comando == "help"){
      try{
      const busca = await message.fetch("")
      busca.delete()
      const command = client.channels.cache.get('815014553666453515')
      if(message.guild.id != '730069592030052376')return
      if(message.member.roles.cache.has("782232736332251156")){
        message.reply('Sistema privado para membros da byte')
        return
      }
      if(message.channel.id != '815014553666453515'){
        const busca1 = await message.fetch("")
        busca1.delete()
        const envio = await message.channel.send(`Vá para o canal ${command}`)
        envio.delete({timeout: 5000})
        return
      }
    
    const help = new MessageEmbed()
    .setTitle("<a:globo:813455999847366687> Sistema do servidor Byte Jr .")
    .setColor('#47dd93')
    .setDescription(
      ':white_small_square: **CONTROLE DE ACESSO AOS CURSOS**\n \n' +
      '**.tabela** \n' +
      '**.curso** nome_da_plataforma \n' +
      '**.c** nome_da_plataforma\n' +
      '**.plataforma** nome_da_plataforma\n' +
      '**.ativar** nome_da_plataforma \n' +
      '**.desativar** nome_da_plataforma\n \n' +
      ':white_small_square: **ADICIONANDO E REMOVENDO UM CURSO** \n \n' + 
      '**.alura** add nome_do_curso \n' +
      '**.b7** add nome_do_curso \n' +
      '**.origamid** add nome_do_curso \n \n' +

      '**.alura** remove nome_do_curso \n' +
      '**.b7** remove nome_do_curso \n' +
      '**.origamid** remove nome_do_curso \n \n \n' +
      '⚠️**ATENÇÃO:** \n Em controle de acesso aos cursos, se não for passado o parametro *"nome da plataforma"* ele irá retornar a tabela'
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/777909174453141525/814168340423114873/Logo---Versao-Responsiva.png')
    .setFooter('Qualquer problema ou duvida entre em contato com TheLopes#5834')
    .setTimestamp()

    await message.channel.send(help)
    }catch{
      erro.setDescription('Erro ao verificar os comandos')
      await message.author.send(erro)
    }
    }
});

client.login(config.token);
