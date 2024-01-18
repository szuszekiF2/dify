const translation = {
  you: '(Você)',
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
  provider: {
    apiKey: 'Chave da API',
    enterYourKey: 'Insira sua chave da API aqui',
    invalidKey: 'Chave da API inválida',
    validatedError: 'Falha na validação: ',
    validating: 'Validando chave...',
    saveFailed: 'Falha ao salvar a chave da API',
    apiKeyExceedBill:
      'Esta chave da API não possui cota disponível, por favor leia',
    addKey: 'Adicionar chave',
    comingSoon: 'Em breve',
    editKey: 'Editar',
    invalidApiKey: 'Chave da API inválida',
    azure: {
      apiBase: 'Base da API',
      apiBasePlaceholder:
        'A URL base da API do seu ponto de extremidade Azure OpenAI.',
      apiKey: 'Chave da API',
      apiKeyPlaceholder: 'Insira sua chave da API aqui',
      helpTip: 'Aprenda sobre o serviço Azure OpenAI',
    },
    openaiHosted: {
      openaiHosted: 'OpenAI Hospedado',
      onTrial: 'EM TESTE',
      exhausted: 'COTA ESGOTADA',
      desc: 'O serviço de hospedagem OpenAI fornecido pela Dify permite que você use modelos como o GPT-3.5. Antes que sua cota de teste seja esgotada, você precisa configurar outros provedores de modelo.',
      callTimes: 'Número de chamadas',
      usedUp:
        'Cota de teste esgotada. Adicione seu próprio provedor de modelo.',
      useYourModel: 'Atualmente usando seu próprio provedor de modelo.',
      close: 'Fechar',
    },
    anthropicHosted: {
      anthropicHosted: 'Anthropic Claude',
      onTrial: 'EM TESTE',
      exhausted: 'COTA ESGOTADA',
      desc: 'Modelo poderoso, que se destaca em uma ampla gama de tarefas, desde diálogos sofisticados e geração de conteúdo criativo até instruções detalhadas.',
      callTimes: 'Número de chamadas',
      usedUp:
        'Cota de teste esgotada. Adicione seu próprio provedor de modelo.',
      useYourModel: 'Atualmente usando seu próprio provedor de modelo.',
      close: 'Fechar',
    },
    anthropic: {
      using: 'A capacidade de incorporação está usando',
      enableTip:
        'Para habilitar o modelo Anthropic, você precisa se vincular ao OpenAI ou ao Azure OpenAI Service primeiro.',
      notEnabled: 'Não habilitado',
      keyFrom: 'Obtenha sua chave da API do Anthropic',
    },
    encrypted: {
      front: 'Sua CHAVE DA API será criptografada e armazenada usando',
      back: ' tecnologia.',
    },
  },
  modelProvider: {
    notConfigured:
      'O modelo do sistema ainda não foi totalmente configurado e algumas funções podem não estar disponíveis.',
    systemModelSettings: 'Configurações do modelo do sistema',
    systemModelSettingsLink:
      'Por que é necessário configurar um modelo do sistema?',
    selectModel: 'Selecione seu modelo',
    setupModelFirst: 'Por favor, configure seu modelo primeiro',
    systemReasoningModel: {
      key: 'Modelo de raciocínio do sistema',
      tip: 'Defina o modelo de inferência padrão a ser usado para criar aplicativos, bem como recursos como geração de nome de diálogo e sugestão de próxima pergunta também usarão o modelo de inferência padrão.',
    },
    embeddingModel: {
      key: 'Modelo de incorporação',
      tip: 'Defina o modelo padrão para o processamento de incorporação de documentos do Conhecimento, tanto a recuperação quanto a importação do Conhecimento usam este modelo de Incorporação para o processamento de vetorização. A troca causará inconsistência na dimensão do vetor entre o Conhecimento importado e a pergunta, resultando em falha na recuperação. Para evitar falhas na recuperação, não altere este modelo arbitrariamente.',
      required: 'O modelo de incorporação é obrigatório',
    },
    speechToTextModel: {
      key: 'Modelo de fala para texto',
      tip: 'Defina o modelo padrão para entrada de fala para texto em conversa.',
    },
    rerankModel: {
      key: 'Modelo de reclassificação',
      tip: 'O modelo de reclassificação reorganizará a lista de documentos candidatos com base na correspondência semântica com a consulta do usuário, melhorando os resultados da classificação semântica',
    },
    quota: 'Cota',
    searchModel: 'Modelo de pesquisa',
    noModelFound: 'Nenhum modelo encontrado para {{model}}',
    models: 'Modelos',
    showMoreModelProvider: 'Mostrar mais provedor de modelo',
    selector: {
      tip: 'Este modelo foi removido. Por favor, adicione um modelo ou selecione outro modelo.',
      emptyTip: 'Nenhum modelo disponível',
      emptySetting: 'Por favor, vá para as configurações para configurar',
      rerankTip: 'Por favor, configure o modelo de reclassificação',
    },
    card: {
      quota: 'COTA',
      onTrial: 'Em teste',
      paid: 'Pago',
      quotaExhausted: 'Cota esgotada',
      callTimes: 'Número de chamadas',
      tokens: 'Tokens',
      buyQuota: 'Comprar cota',
      priorityUse: 'Uso prioritário',
      removeKey: 'Remover chave da API',
      tip: 'A cota paga terá prioridade. A cota de teste será usada após a cota paga ser esgotada.',
    },
    item: {
      deleteDesc:
        '{{modelName}} está sendo usado como modelos de raciocínio do sistema. Algumas funções não estarão disponíveis após a remoção. Por favor, confirme.',
      freeQuota: 'COTA GRATUITA',
    },
    addApiKey: 'Adicionar sua chave da API',
    invalidApiKey: 'Chave da API inválida',
    encrypted: {
      front: 'Sua CHAVE DA API será criptografada e armazenada usando',
      back: ' tecnologia.',
    },
    freeQuota: {
      howToEarn: 'Como ganhar',
    },
    addMoreModelProvider: 'ADICIONAR MAIS PROVEDOR DE MODELO',
    addModel: 'Adicionar modelo',
    modelsNum: '{{num}} Modelos',
    showModels: 'Mostrar modelos',
    showModelsNum: 'Mostrar {{num}} modelos',
    collapse: 'Recolher',
    config: 'Configurar',
    modelAndParameters: 'Modelo e Parâmetros',
    model: 'Modelo',
    featureSupported: '{{feature}} suportado',
    callTimes: 'Número de chamadas',
    buyQuota: 'Comprar cota',
    getFreeTokens: 'Obter tokens gratuitos',
    priorityUsing: 'Uso prioritário',
    deprecated: 'Descontinuado',
    confirmDelete: 'confirmar exclusão?',
    quotaTip: 'Tokens gratuitos disponíveis restantes',
  },
  dataSource: {
    add: 'Adicionar uma fonte de dados',
    connect: 'Conectar',
    notion: {
      title: 'Notion',
      description: 'Usando o Notion como fonte de dados para o Conhecimento.',
      connectedWorkspace: 'Espaço de trabalho conectado',
      addWorkspace: 'Adicionar espaço de trabalho',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      changeAuthorizedPages: 'Alterar páginas autorizadas',
      pagesAuthorized: 'Páginas autorizadas',
      sync: 'Sincronizar',
      remove: 'Remover',
      selector: {
        pageSelected: 'Páginas selecionadas',
        searchPages: 'Pesquisar páginas...',
        noSearchResult: 'Nenhum resultado de pesquisa',
        addPages: 'Adicionar páginas',
        preview: 'PRÉ-VISUALIZAÇÃO',
      },
    },
  },
  plugin: {
    serpapi: {
      apiKey: 'Chave da API',
      apiKeyPlaceholder: 'Insira sua chave da API',
      keyFrom: 'Obtenha sua chave SerpAPI na página da conta SerpAPI',
    },
  },
  apiBasedExtension: {
    title:
      'As extensões de API fornecem gerenciamento centralizado de API, simplificando a configuração para uso fácil em aplicativos da Dify.',
    link: 'Saiba como desenvolver sua própria Extensão de API.',
    linkUrl: 'https://docs.dify.ai/advanced/api_based_extension',
    add: 'Adicionar Extensão de API',
    selector: {
      title: 'Extensão de API',
      placeholder: 'Por favor, selecione a extensão de API',
      manage: 'Gerenciar Extensão de API',
    },
    modal: {
      title: 'Adicionar Extensão de API',
      editTitle: 'Editar Extensão de API',
      name: {
        title: 'Nome',
        placeholder: 'Por favor, insira o nome',
      },
      apiEndpoint: {
        title: 'Endpoint da API',
        placeholder: 'Por favor, insira o endpoint da API',
      },
      apiKey: {
        title: 'Chave da API',
        placeholder: 'Por favor, insira a chave da API',
        lengthError:
          'O comprimento da chave da API não pode ser inferior a 5 caracteres',
      },
    },
  },
  about: {
    changeLog: 'Registro de alterações',
    updateNow: 'Atualizar agora',
    nowAvailable: 'Dify {{version}} está disponível agora.',
    latestAvailable: 'Dify {{version}} é a versão mais recente disponível.',
  },
  appMenus: {
    overview: 'Visão geral',
    promptEng: 'Prompt Eng.',
    apiAccess: 'Acesso à API',
    logAndAnn: 'Logs e Anúncios',
  },
  environment: {
    testing: 'TESTE',
    development: 'DESENVOLVIMENTO',
  },
  appModes: {
    completionApp: 'Gerador de Texto',
    chatApp: 'Aplicativo de Chat',
  },
  datasetMenus: {
    documents: 'Documentos',
    hitTesting: 'Teste de Recuperação',
    settings: 'Configurações',
    emptyTip:
      'O Conhecimento não foi associado, por favor, vá para o aplicativo ou plug-in para completar a associação.',
    viewDoc: 'Ver documentação',
    relatedApp: 'aplicativos vinculados',
  },
  voiceInput: {
    speaking: 'Fale agora...',
    converting: 'Convertendo para texto...',
    notAllow: 'microfone não autorizado',
  },
  modelName: {
    'gpt-3.5-turbo': 'GPT-3.5-Turbo',
    'gpt-3.5-turbo-16k': 'GPT-3.5-Turbo-16K',
    'gpt-4': 'GPT-4',
    'gpt-4-32k': 'GPT-4-32K',
    'text-davinci-003': 'Text-Davinci-003',
    'text-embedding-ada-002': 'Text-Embedding-Ada-002',
    'whisper-1': 'Whisper-1',
    'claude-instant-1': 'Claude-Instant',
    'claude-2': 'Claude-2',
  },
  chat: {
    renameConversation: 'Renomear Conversa',
    conversationName: 'Nome da conversa',
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
      'Escreva sua palavra de prompt aqui, digite \'{\' para inserir uma variável, digite \'/\' para inserir um bloco de conteúdo de prompt',
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
        edit: 'Editar Nomes dos Papéis da Conversa',
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
    existed: 'Já existe no prompt',
  },
  imageUploader: {
    uploadFromComputer: 'Enviar do computador',
    uploadFromComputerReadError:
      'Falha na leitura da imagem, por favor, tente novamente.',
    uploadFromComputerUploadError:
      'Falha no envio da imagem, por favor, envie novamente.',
    uploadFromComputerLimit:
      'As imagens enviadas não podem exceder {{size}} MB',
    pasteImageLink: 'Colar link da imagem',
    pasteImageLinkInputPlaceholder: 'Cole o link da imagem aqui',
    pasteImageLinkInvalid: 'Link da imagem inválido',
    imageUpload: 'Envio de imagem',
  },
}

export default translation