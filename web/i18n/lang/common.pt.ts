const translation = {
  api: {
    success: 'Sucesso',
    actionSuccess: 'Ação bem-sucedida',
    saved: 'Salvo',
    create: 'Criado',
    remove: 'Removido',
  },
  operation: {
    create: 'Criar',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    clear: 'Limpar',
    save: 'Salvar',
    edit: 'Editar',
    add: 'Adicionar',
    refresh: 'Reiniciar',
    reset: 'Redefinir',
    search: 'Buscar',
    change: 'Alterar',
    remove: 'Remover',
    send: 'Enviar',
    copy: 'Copiar',
    lineBreak: 'Quebra de linha',
    sure: 'Tenho certeza',
    download: 'Baixar',
    delete: 'Excluir',
    settings: 'Configurações',
    setup: 'Configurar',
    getForFree: 'Obter gratuitamente',
    reload: 'Recarregar',
    ok: 'OK',
    log: 'Log',
    learnMore: 'Saiba mais',
    params: 'Parâmetros',
  },
  placeholder: {
    input: 'Por favor, digite',
    select: 'Por favor, selecione',
  },
  unit: {
    char: 'caracteres',
  },
  actionMsg: {
    noModification: 'Sem modificações no momento.',
    modifiedSuccessfully: 'Modificado com sucesso',
    modifiedUnsuccessfully: 'Modificação sem sucesso',
    copySuccessfully: 'Copiado com sucesso',
    paySucceeded: 'Pagamento realizado com sucesso',
    payCancelled: 'Pagamento cancelado',
    generatedSuccessfully: 'Gerado com sucesso',
    generatedUnsuccessfully: 'Geração sem sucesso',
  },
  menus: {
    status: 'beta',
    explore: 'Explorar',
    apps: 'Construir Apps',
    plugins: 'Plugins',
    pluginsTips:
      'Integre plugins de terceiros ou crie plugins compatíveis com ChatGPT.',
    datasets: 'Conhecimento',
    datasetsTips:
      'EM BREVE: Importe seus próprios dados de texto ou escreva dados em tempo real via Webhook para aprimoramento de contexto LLM.',
    newApp: 'Novo App',
    newDataset: 'Criar Conhecimento',
  },
  userProfile: {
    settings: 'Configurações',
    workspace: 'Espaço de trabalho',
    createWorkspace: 'Criar Espaço de trabalho',
    helpCenter: 'Ajuda',
    roadmapAndFeedback: 'Roadmap e Feedback',
    community: 'Comunidade',
    about: 'Sobre',
    logout: 'Sair',
  },
  settings: {
    accountGroup: 'CONTA',
    workplaceGroup: 'ESPAÇO DE TRABALHO',
    account: 'Minha conta',
    members: 'Membros',
    billing: 'Faturamento',
    integrations: 'Integrações',
    language: 'Idioma',
    provider: 'Provedor de Modelo',
    dataSource: 'Fonte de Dados',
    plugin: 'Plugins',
    apiBasedExtension: 'Extensão de API',
  },
  account: {
    avatar: 'Avatar',
    name: 'Nome',
    email: 'Email',
    password: 'Senha',
    passwordTip:
      'Você pode definir uma senha permanente se não quiser usar códigos de login temporários',
    setPassword: 'Definir uma senha',
    resetPassword: 'Redefinir senha',
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmar senha',
    notEqual: 'As duas senhas são diferentes.',
  },
  model: {
    params: {
      temperature: 'Temperatura',
      temperatureTip:
        'Controla a aleatoriedade: Reduzir resulta em completamentos menos aleatórios. À medida que a temperatura se aproxima de zero, o modelo se tornará determinístico e repetitivo.',
      top_p: 'Top P',
      top_pTip:
        'Controla a diversidade por meio da amostragem de núcleo: 0,5 significa que metade de todas as opções ponderadas pela probabilidade são consideradas.',
      presence_penalty: 'Penalidade de presença',
      presence_penaltyTip:
        'Quanto penalizar os novos tokens com base em se eles aparecem no texto até agora.\nAumenta a probabilidade do modelo falar sobre novos tópicos.',
      frequency_penalty: 'Penalidade de frequência',
      frequency_penaltyTip:
        'Quanto penalizar os novos tokens com base em sua frequência existente no texto até agora.\nDiminui a probabilidade do modelo repetir a mesma linha textualmente.',
      max_tokens: 'Máximo de tokens',
      max_tokensTip:
        'Usado para limitar o comprimento máximo da resposta, em tokens. \nValores maiores podem limitar o espaço restante para palavras de prompt, registros de chat e Conhecimento. \nRecomenda-se definir abaixo de dois terços\ngpt-4-1106-preview, gpt-4-vision-preview max token (input 128k output 4k)',
      maxTokenSettingTip:
        'Sua configuração de máximo de tokens é alta, potencialmente limitando o espaço para prompts, consultas e dados. Considere definir abaixo de 2/3.',
      setToCurrentModelMaxTokenTip:
        'O máximo de tokens foi atualizado para 80% do máximo de tokens do modelo atual {{maxToken}}.',
      stop_sequences: 'Sequências de parada',
      stop_sequencesTip:
        'Até quatro sequências em que a API irá parar de gerar mais tokens. O texto retornado não conterá a sequência de parada.',
      stop_sequencesPlaceholder: 'Digite a sequência e pressione Tab',
    },
    tone: {
      Creative: 'Criativo',
      Balanced: 'Equilibrado',
      Precise: 'Preciso',
      Custom: 'Personalizado',
    },
    addMoreModel: 'Vá para as configurações para adicionar mais modelos',
  },

  members: {
    team: 'Equipe',
    invite: 'Adicionar',
    name: 'NOME',
    lastActive: 'ÚLTIMA ATIVIDADE',
    role: 'FUNÇÕES',
    pending: 'Pendente...',
    owner: 'Proprietário',
    admin: 'Administrador',
    adminTip: 'Pode criar aplicativos e gerenciar configurações da equipe',
    normal: 'Normal',
    normalTip: 'Apenas pode usar aplicativos, não pode criar aplicativos',
    inviteTeamMember: 'Adicionar membro da equipe',
    inviteTeamMemberTip:
      'Eles podem acessar diretamente os dados da sua equipe após fazer login.',
    email: 'Email',
    emailInvalid: 'Formato de email inválido',
    emailPlaceholder: 'Digite os emails',
    sendInvite: 'Enviar convite',
    invitedAsRole: 'Convidado como usuário {{role}}',
    invitationSent: 'Convite enviado',
    invitationSentTip:
      'Convite enviado, e eles podem fazer login no Dify para acessar os dados da sua equipe.',
    invitationLink: 'Link do convite',
    failedinvitationEmails:
      'Os seguintes usuários não foram convidados com sucesso',
    ok: 'OK',
    removeFromTeam: 'Remover da equipe',
    removeFromTeamTip: 'Removerá o acesso à equipe',
    setAdmin: 'Definir como administrador',
    setMember: 'Definir como membro comum',
    disinvite: 'Cancelar o convite',
    deleteMember: 'Excluir membro',
    you: '(Você)',
  },
  integrations: {
    connected: 'Conectado',
    google: 'Google',
    googleAccount: 'Entrar com conta do Google',
    github: 'GitHub',
    githubAccount: 'Entrar com conta do GitHub',
    connect: 'Conectar',
  },
  language: {
    displayLanguage: 'Idioma de exibição',
    timezone: 'Fuso horário',
  },
  modelProvider: {
    notConfigured:
      'O modelo do sistema ainda não foi totalmente configurado e algumas funções podem estar indisponíveis.',
    systemModelSettings: 'Configurações do Modelo do Sistema',
    systemModelSettingsLink:
      'Por que é necessário configurar um modelo do sistema?',
    selectModel: 'Selecione seu modelo',
    setupModelFirst: 'Por favor, configure seu modelo primeiro',
    systemReasoningModel: {
      key: 'Modelo de Raciocínio do Sistema',
      tip: 'Defina o modelo de inferência padrão a ser usado para criar aplicativos, bem como recursos como geração de nome de diálogo e sugestão de próxima pergunta também usarão o modelo de inferência padrão.',
    },
    embeddingModel: {
      key: 'Modelo de Incorporação',
      tip: 'Defina o modelo padrão para o processamento de incorporação de documentos do Conhecimento, tanto a recuperação quanto a importação do Conhecimento usam este modelo de Incorporação para o processamento de vetorização. A troca causará inconsistência na dimensão do vetor entre o Conhecimento importado e a pergunta, resultando em falha na recuperação. Para evitar falhas na recuperação, não altere este modelo indiscriminadamente.',
      required: 'O Modelo de Incorporação é obrigatório',
    },
    speechToTextModel: {
      key: 'Modelo de Fala-para-Texto',
      tip: 'Defina o modelo padrão para entrada de fala-para-texto na conversa.',
    },
    rerankModel: {
      key: 'Modelo de Reordenação',
      tip: 'O modelo de reordenação reorganizará a lista de documentos candidatos com base na correspondência semântica com a consulta do usuário, melhorando os resultados da classificação semântica',
    },
    quota: 'Cota',
  },
  chat: {
    renameConversation: 'Renomear Conversa',
    conversationName: 'Nome da Conversa',
    conversationNamePlaceholder: 'Por favor, insira o nome da conversa',
    conversationNameCanNotEmpty: 'Nome da conversa obrigatório',
    citation: {
      title: 'CITAÇÕES',
      linkToDataset: 'Link para o Conhecimento',
      characters: 'Personagens:',
      hitCount: 'Contagem de recuperação:',
      vectorHash: 'Hash do vetor:',
      hitScore: 'Pontuação de recuperação:',
    },
  },
  promptEditor: {
    placeholder:
      'Escreva sua palavra de estímulo aqui, digite \'{\' para inserir uma variável, digite \'/\' para inserir um bloco de conteúdo de estímulo',
    context: {
      item: {
        title: 'Contexto',
        desc: 'Inserir modelo de contexto',
      },
      modal: {
        title: '{{num}} Conhecimento em Contexto',
        add: 'Adicionar Contexto',
        footer: 'Você pode gerenciar os contextos na seção de Contexto abaixo.',
      },
    },
    history: {
      item: {
        title: 'Histórico da Conversa',
        desc: 'Inserir modelo de mensagem histórica',
      },
      modal: {
        title: 'EXEMPLO',
        user: 'Olá',
        assistant: 'Olá! Como posso ajudar hoje?',
        edit: 'Editar Nomes de Função da Conversa',
      },
    },
    variable: {
      item: {
        title: 'Variáveis e Ferramentas Externas',
        desc: 'Inserir Variáveis e Ferramentas Externas',
      },
      modal: {
        add: 'Nova variável',
        addTool: 'Nova ferramenta',
      },
    },
    query: {
      item: {
        title: 'Consulta',
        desc: 'Inserir modelo de consulta do usuário',
      },
    },
    existed: 'Já existe no estímulo',
  },
  imageUploader: {
    uploadFromComputer: 'Enviar do Computador',
    uploadFromComputerReadError: 'Falha na leitura da imagem, por favor, tente novamente.',
    uploadFromComputerUploadError: 'Falha no envio da imagem, por favor, envie novamente.',
    uploadFromComputerLimit: 'O tamanho das imagens enviadas não pode exceder {{size}} MB',
    pasteImageLink: 'Colar link da imagem',
    pasteImageLinkInputPlaceholder: 'Cole o link da imagem aqui',
    pasteImageLinkInvalid: 'Link da imagem inválido',
    imageUpload: 'Envio de Imagem',
  },
}

export default translation
