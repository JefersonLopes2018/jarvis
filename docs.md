## Documentação do J-A-R-V-I-S
# Autenticação

Esse comando é utilizado para a liberação de salas conforme o seu login no servidor.
O login funciona atravez de senha.

```cmd
?login membro
```
```cmd
?login byte ****
```
```cmd
?login faculdade ****
```
**OBS: privado ao servidor Oficial do J-A-R-V-I-S.**

# Sistemas de fala 

O sistema de falas é composto por varios protocolos. Onde sendo a maioria deles acionado pela a Equipe do J-A-R-V-I-S.
1. Fala  
```cmd
?falar id mensagem
```
```cmd
?falar 714609145223053313 Bom dia!
```
2. Avisos
```cmd
?avisar mensagem
```

```cmd
?avisar Bom dia!
```
**OBS: Esse aviso será enviado ao canal de avisos do servidor oficial do J-A-R-V-I-S**

3. DM 
```cmd
Esse protocolo é acionado automaticamente ao enviar uma mensagem ao privado do bot.
```
4. Privado

```cmd
?privado @user mensagem

```cmd
?privado @TheLopes Bom Dia!
```

5. Timer

```cmd
?time tempo canal mensagem
```
```cmd 
?time 5 714609145223053313 Bom Dia!
```
**OBS: O tempo é em minutos**

6. Noticia

```cmd
?noticia link fonte texto
```
```cmd
?noticia https://cdn.discordapp.com/attachments/714573856613859339/773537424021520384/unknown.png http://www.coxinhanerd.com.br/pre-venda-disney-plus/ TEXTO DA NOTICIA 
```
**OBS: O texto é opcional**

7. Fotos

```cmd
?foto link tipo membro/canal mensagem
```
```cmd
-membro
?foto https://cdn.discordapp.com/attachments/714573856613859339/773537424021520384/unknown.png membro @TheLopes Foto da noticia
```
```cmd
-canal
?foto https://cdn.discordapp.com/attachments/714573856613859339/773537424021520384/unknown.png membro 714609145223053313 Foto da noticia
```
**OBS: O texto/mensagem é opcional**

8. Avisos de chamada

```cmd
?aqui
```
**OBS: Ele ira mandar um aviso em todos os servidores com canais cadastrados no banco de dados, caso não houver umn canal ele irá ignorar.**

# Banco de Dados

1. Criação da biblioteca

```cmd
?newbiblioteca Nome
```

```cmd
?newbiblioteca documentação
```
**OBS: Uma vez criada, não terá como ser removida.**

2. Criação de um item 

```cmd
?newitem biblioteca nome valor
```

```cmd
?newitem documentação discord.js https://discord.js.org/#/
```
3. Criação ou edição de uma chave

```cmd
?newichave biblioteca item nome valor
```

```cmd
?newchave documentação python data 11/11/2020
```
**OBS Esse comando aceita a chamada com ?editchave, já que uma vez que existe a chave no banco de dados, o valor dela será substituido pelo valor informado na chamada. Uma vez criada NÃO tem como ser removida.**

4. Deletar um item

```cmd
?delitem biblioteca item
```

```cmd
?delitem documentação python
```

5. Acessar o Banco de Dados

```cmd
?acessar biblioteca item especificação
?acessar biblioteca item
?acessar biblioteca
```

```cmd
?acessar documentação python data
?acessar documentação python
?acessar documentação
```

# Cargos

1. Criar um cargo

```cmd
?newcargo nome
```

```cmd
?newcargo moderador
```

2. Deletar um cargo

```cmd
?delcargo @menção
```

```cmd
?delcargo @moderador
```

3. Sistema AFK

```cmd
?afk
```
**OBS: Esse cargo ativa e desativa o seu status AFK do sistema do J-A-R-V-I-S**

# Sistema de Verificação

1. Status do J-A-R-V-I-S

```cmd
?status```
Admin:
```cmd
?status servidores
```

2. Verificar sistema AFK

```cmd
?verificar @user
```

```cmd
?verificar @TheLopes
```

3. Busca 

```cmd
?mostrar dono
?mostrar data canal id
?mostrar data membro @user
?mostrar canal lista
?mostrar canal nome
```

```cmd
?mostrar dono
?mostrar data canal 424026852097654794
?mostrar data membro @TheLopes
?mostrar canal lista
?mostrar canal 📃regras
```

# Sistema de salas

1. Criar uma sala

```cmd
?sala
```

2. Deletar a sala

```cmd
?delsala
```

# Moderação

**OBS: Somente a equipe do jarvis consegue executar os protocolos abaixo**
1. Criar um canal

```cmd
?newchannel nome tipo categoria
?newchannel nome tipo 
?newchannel nome 
```

```cmd
?newchannel regras text 392708440809799692
?newchannel regras text 
?newchannel regras 
```
```cmd
?newchannel regras voice 392708440809799692
?newchannel regras voice 
?newchannel regras 
```
**OBS: Quando não especificado, ele irá criar no default, tipo: text**

2. Deletar um canal

```cmd
?delchannel id
```

```cmd
?delchannel 392708440809799692
```
3. Expulsar um membro 


```cmd
?kick @user
```

```cmd
?kick @TheLopes
```

4. Apagar mensagens

```cmd
?delete numero
```

```cmd
?delete 5
```

5. Status do perfil do J-A-R-V-I-S

```cmd
?state mensagem
?state reset
```

```cmd
?state Desligando...
```
