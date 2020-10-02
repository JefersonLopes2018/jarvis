const Discord = require("discord.js"); 
const client = new Discord.Client(); 
const config = require("./config.json"); 
const jimp =require("jimp");
const ytdl = require('ytdl-core');
const queue = new Map();
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("api do yt");

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('banco.json')
const db = low(adapter)

client.on("ready", () => {
  console.log('Estou Pronto para ser usado!');
  console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
});


  
//sistema de entrada

client.on("guildMemberAdd", async member => {
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' });
  let server = member.guild.id
  let Fcanal = client.channels.cache.get("425142094236221440")
  let Tcanal = client.channels.cache.get("597517143080435713")

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
  if(server === "343227251501957121"){
    Fcanal.send(``, { files: ["bemvindo.png"] })
    Fcanal.send(`${member}`)
  }
  else{
    Tcanal.send(``, { files: ["bemvindo.png"] })
    Tcanal.send(`${member}`)
  }
  console.log('Imagem enviada para o Discord')
  })
  .catch(err => {
  console.log('error avatar')
  })
  const add = await member.roles.add("423629707762728970")
})
client.on("guildMemberRemove", member => {
  if (!client.guilds.cache.some(guild => guild.members.cache.has(member.id))) {
      client.users.cache.delete(member.id);
  }
  client.user.setActivity(`${client.users.cache.size} usuarios em ${client.guilds.cache.size} servidores. `, { type: 'PLAYING' })
      .catch(console.error);
  console.log(`${member.username} saiu de nossos servidores`)
});
client.on("message", async message => {

    //if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
//if (!message.guild) return;

  //entrar no canal 
  
  if(comando === "entrar") {
    const busca = await message.fetch("entrar")
    busca.delete()
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      console.log(`Entrou em uma chamada a pedido de ${message.author.username}`)
    } else {
      message.reply('OPS!  Não sei onde entrar!! vá até um canal de voz para me mostrar o caminho e me chame novamente!');
    }
  }
  
  //sair do canal
  if(comando === "sair") {
    const busca = await message.fetch("sair")
    busca.delete()
    if (message.member.voice.channel) {
     const connection = await message.member.voice.channel.leave();
     console.log(`${message.author.username} Me pediu pra sair`)
  } 
    else{
     r = await message.channel.send(`${message.author} Você não está no canal, por favor venha me buscar!`)
     console.log(`${message.author.username} Me pediu pra sair sem estar na minha call`)
     let society = client.channels.cache.get("425150435725279253");
     society.send(`${message.author} Me pediu pra sair sem estar na minha call`);

  }
  
}

  
//sistema de fala
  if (comando === "falar"){
    const busca = await message.fetch("")
    busca.delete()
    let id = args[0]
    let mensagem = args.slice(1).join(' ')
    let canal = client.channels.cache.get(id);
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    canal.send(mensagem)
    }
  }
  
  if (comando === "taberna"){
    const busca = await message.fetch("")
    busca.delete()
    let taberna = client.channels.cache.get("670066825484042242");
    const mensagem = args.join(" ");
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    taberna.send(mensagem).then(message.channel.send("mensagem enviada com sucesso!")).catch(console.error);
    }
    else{
      const f = await message.channel.send(`${message.author} Não recebo ordens de você!!`);
    }
  }
  if(comando === "fsociety"){
    const busca = await message.fetch("")
    busca.delete()
    let society = client.channels.cache.get("393451272034058241");
    const mensagem = args.join(" ");
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    society.send(mensagem).then(message.channel.send("mensagem enviada com sucesso!")).catch(console.error);
    }
    else{
      const f = await message.channel.send(`${message.author} Não recebo ordens de você!!`);
    }
  }
  if (comando === "diz"){
    const busca = await message.fetch("diz")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872" || message.author.id == "703636663473274962"){
    const mensagem = args.join(" ");
    const r = await message.channel.send(mensagem);
    
    }
    else{
    const f = await message.channel.send(`${message.author} Não recebo ordens de você!!`);
    }
  }
  if(comando ==="responder"){
    let staff = client.channels.cache.get("425150435725279253");
    const msg = `O membro **${message.author.username}** respondeu: \n ${message.content}`
    staff.send(msg)
  }
  if(comando === "privado"){
    const busca = await message.fetch("privado")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872" || message.author.id == "703636663473274962"){
    let membro = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let mensagem = args.slice(1).join(' ')
    if(!membro)return message.channel.send("Você não informou um membro!");
    if(!mensagem)return message.channel.send("Você não informou uma mensagem!")
    membro.send(mensagem).then(message.author.send(`<**${mensagem}**> foi enviada com sucesso para ${membro}!`)).catch(console.error);
    membro.send("Caso queira responder é só por **?responder** antes da sua resposta que eu repasso a inha equipe, ou você pode deixar só entre nós ;)")
    }
  }
  
  if(comando ==="time"){
    const busca = await message.fetch("time")
    busca.delete()
    let time = args[0]
    let tempo = time * 1000 * 60
    let id = args[1]
    let mensagem = args.slice(2).join(' ')
    let canal = client.channels.cache.get(id);
    const dados = message.author.send(`Sera enviado **${mensagem}** no canal ${canal} daqui a ${time} minutos.`)
    setTimeout(()=> canal.send(mensagem),tempo)
  }
  if(comando === "noticia"){
    const busca = await message.fetch("noticia")
    busca.delete()
    const imagem = args[0]
    const fonte = args[1]
    const texto = args.slice(2).join(' ')
    let canal = client.channels.cache.get("714572433822187571")
    if(!texto){
      console.log("texto vazio")
       texto = ' '
    }
    canal.send( { files: [imagem] }).then(message.author.send("Noticia postada com sucesso!")).catch(console.error);
    setTimeout(()=> canal.send(texto),1000)
    setTimeout(()=>canal.send("**Fonte:** " + fonte),2000)
  }
  if(comando ==="foto"){
    const busca = await message.fetch("foto")
    busca.delete()
    let link = args[0]
    let tipo = args[1]
    let mensagem = args.slice(3).join(' ')
    if(!mensagem){
      let mensagem = ` `
    }
    if(tipo === "canal"){
      let id = args[2]
      let canal = client.channels.cache.get(id)
      canal.send(mensagem, { files: [link] }).then(message.author.send("Foto enviada com sucesso!")).catch(console.error);
      
    }
    if(tipo === "membro"){
      let membro =  message.mentions.members.first() || message.guild.members.cache.get(args[2])
      membro.send(mensagem, { files: [link] }).then(message.author.send("Foto enviada com sucesso!")).catch(console.error);
      
    }
  }

  if (comando === "aqui"){
    let taberna = client.channels.cache.get("670066825484042242");
    let society = client.channels.cache.get("393451272034058241");
    const busca = await message.fetch("aqui")
    busca.delete()
    if(message.guild.id === "343227251501957121"){
      taberna.send(`${message.author} :loud_sound:  Está em call no servidor ${message.guild}.`)
      console.log(`${message.author.username} Está em call no servidor ${message.guild}.`)}
    else{
      society.send(`${message.author} :loud_sound:  Está em call no servidor ${message.guild}.`)
      console.log(`${message.author.username} Está em call no servidor ${message.guild}.`)}
    
  }
  if(comando === "jarvis") {
    const busca = await message.fetch("jarvis")
    busca.delete()
    let canal = client.channels.cache.get("425150435725279253");
    const titulo = args[0]
    const mensagem = args[1]
    const m = await message.channel.send(`:slight_smile:  Olá, ${message.author} sua mensagem foi enviada com sucesso!`);
    canal.send(`Titulo: **${titulo}** Mensagem: **${mensagem}** Author: **${message.author}**`)
  }
//Banco de Dados
  if(comando ==="bservidor"){
    const busca = await message.fetch("bservidor")
    busca.delete()
    db.set(message.guild.name, []).write()
    message.channel.send("Esse servidor foi adicionado em meu banco de dados.")
  }
//usuarios comuns
  if(comando === "bperfil") {
    const busca = await message.fetch("")
    busca.delete()
    db.get(message.guild.name)
    .push({
    id: message.author.id,
    nick: message.author.username
  
    }).write()
    message.channel.send('Perfil criado com sucesso!')
  }
  if(comando === "badd"){
    const busca = await message.fetch("")
    busca.delete()
    if(!args[0])return message.channel.send('Você esqueceu de informar oque vai adicionar. ')
    if(!args[1])return message.channel.send('Você esqueceu de informar um argumento. ')
    let novonome = args[1]
    db.get(message.guild.name)
    .find({id: message.author.id}).assign({[args[0]]: novonome}).write()
    message.channel.send('Item adicionado ao seu banco de dados particular.')  
  }
  if(comando === "beditar"){
    const busca = await message.fetch("")
    busca.delete()
    if(!args[0])return message.channel.send('Você esqueceu de informar um argumento. ')
    if(!args[1])return message.channel.send('Você esqueceu de informar um argumento. ')
    if(args[0] === "id")return message.channel.send('Você Não pode alterar seu ID. ')
    let novonome = args[1]
    db.get(message.guild.name)
    .find({id: message.author.id}).assign({[args[0]]: novonome}).write()
    message.channel.send('Perfil editado com sucesso!')
 }
  if(comando ==="bacessar"){
    const busca = await message.fetch("")
    busca.delete()
    
    let objeto = db.get(message.guild.name).find({id: message.author.id}).value()
    let chave = Object.keys(objeto)
    let entrada = args[0]
    if(!entrada){
    message.channel.send(`*Você acessou o perfil de* ${message.author} \n -Aqui está seus itens.`)
    message.channel.send("**-----------------------------------------------------**")
    message.channel.send(chave)
    message.channel.send("**-----------------------------------------------------**")
    message.channel.send(`-Para acessar os itens acima precisa utilizar a chave de acesso de cada item. A chave de acesso é a ordem que o item está na lista.`)
    }
    else{
    let item = entrada * 1000 / 1000
    let i = item - 1
    message.author.send(objeto[chave[i]])
    }
  }
//usuarios vip
  if(comando === "blimpar"){
    const busca = await message.fetch("")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
    db.get(message.guild.name).remove({id: message.author.id}).write()
    }
    else{
    message.channel.send("Você não tem permissão!")
    }
}
  
  
//cargos 
  if(comando === "newcargo"){
    const busca = await message.fetch("newcargo")
    busca.delete()
    let nome = args[0]
    const cargo = await message.guild.roles.create({ data: {
      name: nome,
    },}).then(message.channel.send("Cargo criado com sucesso!")).catch(console.error);
  }
  if(comando === "excargo"){
    const busca = await message.fetch("excargo")
    busca.delete()
    const cargo = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.roles;
    cargo.delete().then(message.channel.send("Cargo deletado com sucesso!")).catch(console.error);
  }

    if (comando === "afk"){
    const busca = await message.fetch("afk")
    busca.delete()
    if(message.guild.id === "386316232309342209"){
      message.channel.send("**ATENÇÃO:** Você está fora dos servidores **F SOCIETY**. aqui n existe o cargo base para o sistema **AFK**")
    }
    else{
    if (!message.member.roles.cache.has("703382637858914353")) {
     const add = await message.member.roles.add("703382637858914353")
     const confirmar = await message.channel.send(" :inbox_tray:**CARREGANDO**")
     setTimeout(()=> confirmar.edit("**.**"),2000)
     setTimeout(()=> confirmar.edit("**..**"),2000);
     setTimeout(()=> confirmar.edit("**...**"),2000);
     setTimeout(()=> confirmar.edit("Seu status foi definido para: :x: **OFFLINE**"),3000);
     console.log(`${message.author.username} Definiu AFK online!`)}
  else{
    const remover = await message.member.roles.remove("703382637858914353")
    const confirmar = await message.channel.send(" :inbox_tray: **CARREGANDO**")
     setTimeout(()=> confirmar.edit("**.**"),2000)
     setTimeout(()=> confirmar.edit("**..**"),2000);
     setTimeout(()=> confirmar.edit("**...**"),2000);
     setTimeout(()=> confirmar.edit("Seu status foi definido para:  :white_check_mark:**ONLINE**"),3000);
  
    
    console.log(`${message.author.username} Definiu AFK offline!`)
 }}
}
// sistema de verificação
  if(comando === "status") {
    const busca = await message.fetch("status")
    busca.delete()
    const status = await message.channel.send(":inbox_tray: **CARREGANDO**");
    setTimeout(()=> status.edit("**.**"),3000)
    setTimeout(()=> status.edit("**..**"),3000);
    setTimeout(()=> status.edit("**...**"),3000);
    setTimeout(() => status.edit(`:bar_chart: Funcionando com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais e ${client.guilds.cache.size} servidores.`), 4000);
  
    console.log(`${message.author.username} Pediu o Status`)
  }
  if(comando === "verificar"){
    const busca = await message.fetch("verificar")
    busca.delete()
    if(message.guild.id === "386316232309342209"){
      message.channel.send("**ATENÇÃO:** Você está fora dos servidores **F SOCIETY**. aqui n existe o cargo base para o sistema **AFK**")
    }
    else{
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (message.member.roles.cache.has("703382637858914353")) {
      const r = await message.channel.send(":x: Ele está offline")
      console.log(`${message.author.username} Verificou se um membro está online. (membro OFF)`)
    } else {
     const r = await message.channel.send(":white_check_mark:  Ele está online")
     console.log(`${message.author.username} Verificou se um membro está online. (membro ON)`)
     
   }
  }
  }

  if(comando === "buscar"){
    const busca = await message.fetch("buscar")
    busca.delete()
    const tipo = args[0]
    const nome = args[1]
    const membro = args[2]
    if(!tipo && !nome){
      const erro = await message.channel.send(`${message.author} Busca invalida!`)
    }
    if(tipo === "dono" || tipo === "Dono"){
      const resposta= await message.channel.send(`Criador do servidor: **${message.guild.owner.user.username}**`)
    }
    if(tipo === "data" || tipo ==="Data"){
      if(!nome){
        const erro = await message.channel.send(`${message.author} Você não informou o que a ser buscado!`)
      }
      else{
        if(nome === "canal"){
          const id = args[2]
          if(!id)return message.channel.send("Você não informou o ID do canal.")
  
          message.channel.send(`?diz ?data canal ${id}`)
        }
        if(nome ==="membro"){
          message.channel.send(`?diz ?data membro ${membro}`)
        }
      }
    }
    if(tipo === "canal" || tipo === "Canal"){
      if(!nome){
        const erro = await message.channel.send(`${message.author} Você não informou o nome do canal a ser buscado!`)
      }
      else{
        if(nome === "lista"){
            const lista = await message.guild.channels.cache.map((i) => i.name);
            const enviar = await message.channel.send(lista)
          }
          
        let channel = message.guild.channels.cache.find(c => c.name === nome);
        if(!channel){
          if(nome === "lista")return;
          else{
          const erro = await message.channel.send(`${message.author} Não encontrei nenhum canal com esse nome.`)
          }
        }
        
        else{
          const confirmado = await message.channel.send(`${message.author} Encontrei canal com esse nome. aqui está o ID dele...${channel.id}`)
        }
      }
    }
  }
  if(comando === "data"){
    const busca = await message.fetch("data")
    busca.delete()
    const tipo = args[0]
    if(!tipo)return message.channel.send("Não informou do que quer saber a data. ")
    if(tipo === "canal"){
      const id = args[1]
      if(!id)return message.channel.send("Você não informou o ID do canal.")
      const canal =  client.channels.cache.get(id);
      const dados =  canal.createdAt
      let data = dados.toLocaleDateString()
      message.channel.send(`${canal} foi criado em **${data}**`)
    }
    if(tipo ==="membro"){
      membro = message.mentions.members.first() || message.guild.members.cache.get(args[2]) || message.member;
      const dados = membro.user.createdAt
      let data = dados.toLocaleDateString()
      message.channel.send(`O membro ${membro} entrou no discord em **${data}**`)
    }
  }


  //moderação
  if(comando === "apagar"){
    let id = args.join(" ")
    let canal = client.channels.cache.get(id);
   
    const busca = await message.fetch("apagar")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      if(!id){
        const r = await message.channel.send(`${message.author} Não enviou nenhum ID para eu apagar!`)
          }
      else{
      const apagarCanal = await canal.delete()}
    }
    else{
    const erro = await message.channel.send(`${message.author} Não recebo ordens de você! `)
    }
  }
  if (comando === "kick"){
    const busca = await message.fetch("kick")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      const membro = message.mentions.members.first()
      const kick = await membro.kick()}
    else{
      const f = await message.channel.send(`${message.author} Não recebo ordens de você!!`);
    }
  }
  
  if(comando === "criar"){
    const busca = await message.fetch("criar")
    busca.delete()
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      let nome = args[0]
      let tipo = args[1]
      let categoria = args[2]
  
      if(!nome && !tipo && !categoria){
        message.channel.send(`${message.author} Você não Definiu um nome para o canal e o tipo de canal!`)
      }else{
        await message.guild.channels.create(nome, {type: tipo, parent: categoria}).catch(console.error);
      }
    }
  }

  if(comando === "sala"){
    const busca = await message.fetch("sala")
    busca.delete()
    const categoria = await message.guild.channels.create("🎮SALA", {type: "category"}).catch(console.error);
    let categoriaID = message.guild.channels.cache.find(c => c.name === "🎮SALA"); 
    const canal =  await message.guild.channels.create("💬chat", {type: "text" , parent: categoria.id }).catch(console.error);
    const voice =  await message.guild.channels.create("🔊CHAMADA", {type: "voice" , parent: categoria.id }).catch(console.error);
  }
  if(comando ==="salap"){
    const busca = await message.fetch("salap")
    busca.delete()
    let categoria = message.guild.channels.cache.find(c => c.name === "🎮SALA");
    let text = message.guild.channels.cache.find(c => c.name === "💬chat");
    let voice = message.guild.channels.cache.find(c => c.name === "🔊CHAMADA");
    const apagar = await categoria.delete()
    const apagar1 = await text.delete()
    const apagar2 = await voice.delete()
  }
  if(comando === "delete"){
    const busca = await message.fetch("delete")
    busca.delete()
    let qt = args[0]
    if (message.member.roles.cache.has("463052822175285268") || message.author.id == "334359138110799872"){
      if(!qt){
      const erro = await message.channel.send(`${message.author} Não me informou quantas mensagens devo apagar!`)
      }
    else{
      setTimeout(() => {message.channel.bulkDelete(qt);}, 2000);
    }
  }
  }
  if(comando === "encerrar"){
  client.user.setActivity(`ENCERRANDO...`, { type: 'PLAYING' })
    .catch(console.error);
  }
});

client.login(config.token);
