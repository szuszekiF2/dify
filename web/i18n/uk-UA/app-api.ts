const translation = {
  apiServer: 'API сервер',
  apiKey: 'Ключ API',
  status: 'Статус',
  disabled: 'Вимкнено',
  ok: 'Працює',
  copy: 'Копіювати',
  copied: 'Скопійовано',
  play: 'Відтворити',
  pause: 'Пауза',
  playing: 'Відтворення',
  merMaind: {
    rerender: 'Повторити рендер',
  },
  never: 'Ніколи',
  apiKeyModal: {
    apiSecretKey: 'Секретний ключ API',
    apiSecretKeyTips: 'Щоб запобігти зловживанням API, захистіть свій ключ API. Уникайте його використання як звичайного тексту у  front-end коді. :)',
    createNewSecretKey: 'Створити новий секретний ключ',
    secretKey: 'Секретний ключ',
    created: 'СТВОРЕНО',
    lastUsed: 'ОСТАННЄ ВИКОРИСТАННЯ',
    generateTips: 'Зберігайте цей ключ у безпечному та доступному місці.',
  },
  actionMsg: {
    deleteConfirmTitle: 'Видалити цей секретний ключ?',
    deleteConfirmTips: 'Цю дію не можна скасувати.',
    ok: 'Гаразд',
  },
  chatMode: {
    title: 'API чат-додатку',
    info: 'Для універсальних чат-ботів, що використовують формат запитання-відповіді, викличте API chat-messages, щоб розпочати діалог. Підтримуйте безперервні розмови, передаючи conversation_id, що повертається. Параметри відповідей і шаблони залежать від налаштувань AiConec Studio Prompt.',
    createChatApi: 'Створити повідомлення чату',
    createChatApiTip: 'Створіть нове повідомлення розмови або продовжте існуючий діалог.',
    inputsTips: '(Необов’язково) Надайте поля введення користувача як пари ключ-значення, які відповідають змінним у Prompt. Ключ – це ім’я змінної, Значення – це значення параметра. Якщо тип поля Select, надіслане значення має бути одним із встановлених параметрів.',
    queryTips: 'Вміст введення/запитання користувача',
    blocking: 'Тип блокування, очікування завершення виконання та повернення результатів. (Запити можуть бути перервані, якщо процес тривалий)',
    streaming: 'повернення потокового передавання. Реалізація повернення потокового передавання на основі SSE (Server-Sent Events).',
    conversationIdTip: '(Опціонально) Ідентифікатор розмови: залиште порожнім для першої розмови; передайте conversation_id з контексту, щоб продовжити діалог.',
    messageFeedbackApi: 'Фідбек із повідомленнями сеансу користувача, наприклад',
    messageFeedbackApiTip: 'Оцінюйте отримані повідомлення від імені кінцевих користувачів за допомогою лайків або дизлайків. Ці дані відображаються на сторінці "Журнали та анотації" та використовуються для майбутнього точного налаштування моделі.',
    messageIDTip: 'Ідентифікатор повідомлення',
    ratingTip: 'подобається чи не подобається, null — скасувати',
    chatMsgHistoryApi: 'Отримати повідомлення з історії чату',
    chatMsgHistoryApiTip: 'Перша сторінка повертає останній `обмежений` рядок, який знаходиться у зворотному порядку',
    chatMsgHistoryConversationIdTip: 'Ідентифікатор розмови',
    chatMsgHistoryFirstId: 'Ідентифікатор першого запису чату на поточній сторінці. Типовим є відсутність.',
    chatMsgHistoryLimit: 'Скільки чатів повертається в одному запиті',
    conversationsListApi: 'Отримати список розмов',
    conversationsListApiTip: 'Отримує список сеансів поточного користувача. За замовчуванням повертаються останні 20 сеансів.',
    conversationsListFirstIdTip: 'Ідентифікатор останнього запису на поточній сторінці, значення за замовчуванням відсутнє.',
    conversationsListLimitTip: 'Скільки чатів повертається в одному запиті',
    conversationRenamingApi: 'Перейменування розмови',
    conversationRenamingApiTip: 'Перейменуйте розмови; ім’я відображається в інтерфейсах клієнтів із кількома сеансами.',
    conversationRenamingNameTip: 'Нове ім’я',
    parametersApi: 'Отримання інформації про параметри програми',
    parametersApiTip: 'Отримати налаштовані вхідні параметри, включаючи імена змінних, імена полів, типи та значення за замовчуванням. Зазвичай використовується для відображення цих полів у формі або заповнення значень за замовчуванням після завантаження клієнта.',
  },
  develop: {
    requestBody: 'Тіло запиту',
    pathParams: 'Параметри шляху',
    query: 'Запит',
  },
}

export default translation
