import { DEMO_USER_ID } from '@/config/demo'
import type { AppNotification, Board, Status, Task, User, WorkspaceData } from '@/types'
import { addDays, toDateKey } from '@/utils/date'

const ME = DEMO_USER_ID

const users: User[] = [
  {
    id: ME,
    name: 'Андрей Соколов',
    email: 'andrey.sokolov@example.com',
    gender: 'male',
    color: '#0c8ab0',
    avatarUrl: `${import.meta.env.BASE_URL}avatars/car.jpg`,
  },
  {
    id: 'u-maria',
    name: 'Мария Соколова',
    email: 'maria.sokolova@example.com',
    gender: 'female',
    color: '#d9468f',
    avatarUrl: `${import.meta.env.BASE_URL}avatars/flower.jpg`,
  },
  {
    id: 'u-dmitry',
    name: 'Дмитрий Соколов',
    email: 'dmitry.sokolov@example.com',
    gender: 'male',
    color: '#ec7f1f',
  },
  {
    id: 'u-olga',
    name: 'Ольга Соколова',
    email: 'olga.sokolova@example.com',
    gender: 'female',
    color: '#1f9d6b',
  },
  {
    id: 'u-ivan',
    name: 'Иван Кузнецов',
    email: 'ivan.kuznetsov@example.com',
    gender: 'male',
    color: '#7656db',
  },
  {
    id: 'u-anna',
    name: 'Анна Белова',
    email: 'anna.belova@example.com',
    gender: 'female',
    color: '#0e9bb2',
    avatarUrl: `${import.meta.env.BASE_URL}avatars/gradient.svg`,
  },
]

const boards: Board[] = [
  { id: 'b-home', name: 'Дом', ownerId: 'u-maria', memberIds: ['u-maria', ME, 'u-olga', 'u-anna'] },
  { id: 'b-shopping', name: 'Покупки', ownerId: 'u-olga', memberIds: ['u-olga', ME, 'u-maria'] },
  { id: 'b-repair', name: 'Ремонт', ownerId: ME, memberIds: [ME, 'u-maria', 'u-dmitry', 'u-ivan'] },
  { id: 'b-car', name: 'Машина', ownerId: 'u-dmitry', memberIds: ['u-dmitry', ME, 'u-ivan'] },
]

interface TaskSeed {
  boardId: string
  status: Status
  title: string
  description: string
  assigneeIds: string[]
  creatorId: string
  due: number
  subtasks: string[]
  done: number
  comments?: number
}

const taskSeeds: TaskSeed[] = [
  {
    boardId: 'b-home',
    status: 'todo',
    title: 'Генеральная уборка',
    description: 'Помыть окна, разобрать шкаф в прихожей, сдать пальто в химчистку.',
    assigneeIds: [ME, 'u-maria'],
    creatorId: 'u-maria',
    due: 5,
    subtasks: ['Окна', 'Шкаф в прихожей', 'Химчистка'],
    done: 0,
    comments: 2,
  },
  {
    boardId: 'b-home',
    status: 'waiting',
    title: 'Мастер для стиральной машины',
    description: 'Машинка не сливает воду. Мастер придет в четверг после 18:00.',
    assigneeIds: ['u-maria'],
    creatorId: 'u-maria',
    due: 2,
    subtasks: ['Оставить заявку', 'Подтвердить визит', 'Оплатить ремонт'],
    done: 2,
    comments: 2,
  },
  {
    boardId: 'b-home',
    status: 'todo',
    title: 'Оплатить коммуналку',
    description: 'Передать показания счетчиков и оплатить квитанции до 25 числа.',
    assigneeIds: [ME],
    creatorId: 'u-maria',
    due: 3,
    subtasks: ['Показания воды', 'Электричество', 'Оплата'],
    done: 0,
    comments: 1,
  },
  {
    boardId: 'b-home',
    status: 'progress',
    title: 'Починить кран на кухне',
    description: 'Подтекает смеситель, нужно поменять картридж.',
    assigneeIds: [ME],
    creatorId: 'u-maria',
    due: 1,
    subtasks: ['Купить картридж', 'Перекрыть воду', 'Заменить'],
    done: 1,
    comments: 3,
  },
  {
    boardId: 'b-home',
    status: 'waiting',
    title: 'Предупредить соседей',
    description: 'Повесить объявление о шумных работах и оставить номер телефона.',
    assigneeIds: ['u-maria', 'u-anna'],
    creatorId: ME,
    due: 0,
    subtasks: ['Написать объявление', 'Повесить в подъезде', 'Зайти к соседям снизу'],
    done: 2,
    comments: 2,
  },
  {
    boardId: 'b-home',
    status: 'done',
    title: 'Разобрать балкон',
    description: 'Вынесли старые лыжи и коробки, освободили место под сушилку.',
    assigneeIds: [ME, 'u-maria'],
    creatorId: 'u-maria',
    due: -8,
    subtasks: ['Разобрать коробки', 'Вывезти хлам', 'Помыть пол'],
    done: 3,
    comments: 2,
  },
  {
    boardId: 'b-home',
    status: 'done',
    title: 'Помыть окна после лета',
    description: 'Окна во всех комнатах и на балконе, сетки снять и убрать до весны.',
    assigneeIds: [ME, 'u-maria'],
    creatorId: 'u-maria',
    due: -46,
    subtasks: ['Комнаты', 'Кухня', 'Балкон', 'Сетки'],
    done: 4,
    comments: 2,
  },
  {
    boardId: 'b-home',
    status: 'done',
    title: 'Починить дверцу шкафа',
    description: 'Дверца на кухне висела на одной петле, поменяли обе петли.',
    assigneeIds: [ME],
    creatorId: 'u-olga',
    due: -74,
    subtasks: ['Купить петли', 'Поменять'],
    done: 2,
    comments: 1,
  },

  {
    boardId: 'b-shopping',
    status: 'waiting',
    title: 'Доставка из гипермаркета',
    description: 'Заказ оформлен, курьер привезет сегодня вечером.',
    assigneeIds: ['u-maria'],
    creatorId: ME,
    due: 0,
    subtasks: ['Оформить заказ', 'Встретить курьера', 'Проверить чек'],
    done: 1,
    comments: 3,
  },
  {
    boardId: 'b-shopping',
    status: 'todo',
    title: 'Закупка на неделю',
    description: 'Большой список продуктов в гипермаркет на выходных.',
    assigneeIds: [ME, 'u-maria'],
    creatorId: 'u-olga',
    due: 2,
    subtasks: ['Молоко и сыр', 'Овощи и фрукты', 'Курица и рыба', 'Крупы', 'Кофе'],
    done: 0,
    comments: 2,
  },
  {
    boardId: 'b-shopping',
    status: 'progress',
    title: 'Заказать воду',
    description: 'Четыре бутыли питьевой воды с доставкой на дом.',
    assigneeIds: [ME],
    creatorId: ME,
    due: 1,
    subtasks: ['Выбрать время доставки', 'Оплатить'],
    done: 1,
  },
  {
    boardId: 'b-shopping',
    status: 'todo',
    title: 'Бытовая химия',
    description: 'Порошок, средство для посуды, губки и мусорные пакеты.',
    assigneeIds: ['u-olga'],
    creatorId: 'u-olga',
    due: 4,
    subtasks: ['Порошок', 'Средство для посуды', 'Губки', 'Мусорные пакеты'],
    done: 0,
    comments: 1,
  },
  {
    boardId: 'b-shopping',
    status: 'done',
    title: 'Купить корм коту',
    description: 'Большой мешок сухого корма и пара упаковок влажного.',
    assigneeIds: ['u-olga'],
    creatorId: 'u-olga',
    due: -2,
    subtasks: ['Сухой корм', 'Влажный корм'],
    done: 2,
    comments: 2,
  },
  {
    boardId: 'b-shopping',
    status: 'done',
    title: 'Банки для заготовок',
    description: 'Двадцать банок и крышки для огурцов и варенья.',
    assigneeIds: ['u-olga'],
    creatorId: 'u-olga',
    due: -39,
    subtasks: ['Банки', 'Крышки'],
    done: 2,
    comments: 1,
  },
  {
    boardId: 'b-shopping',
    status: 'done',
    title: 'Рюкзак и канцелярия к 1 сентября',
    description: 'Племяннице: рюкзак, тетради, пенал и ручки.',
    assigneeIds: ['u-maria', ME],
    creatorId: 'u-olga',
    due: -61,
    subtasks: ['Рюкзак', 'Тетради', 'Пенал и ручки'],
    done: 3,
    comments: 2,
  },

  {
    boardId: 'b-repair',
    status: 'progress',
    title: 'Демонтаж старой плитки',
    description: 'В ванной снять плитку со стен и пола, вынести строительный мусор.',
    assigneeIds: ['u-dmitry', 'u-ivan'],
    creatorId: ME,
    due: 2,
    subtasks: ['Закрыть пленкой коридор', 'Снять плитку со стен', 'Снять плитку с пола', 'Вывезти мусор'],
    done: 2,
    comments: 5,
  },
  {
    boardId: 'b-repair',
    status: 'todo',
    title: 'Выбрать плитку',
    description: 'Съездить в строительный магазин, сравнить коллекции и цены, взять образцы.',
    assigneeIds: [ME, 'u-maria'],
    creatorId: ME,
    due: 4,
    subtasks: ['Составить список магазинов', 'Съездить в магазин', 'Взять образцы', 'Согласовать цвет'],
    done: 0,
    comments: 3,
  },
  {
    boardId: 'b-repair',
    status: 'todo',
    title: 'Заказать сантехнику',
    description: 'Унитаз, раковина с тумбой и смеситель. Сравнить цены в трех магазинах.',
    assigneeIds: [ME],
    creatorId: 'u-maria',
    due: 7,
    subtasks: ['Замерить место под тумбу', 'Выбрать смеситель', 'Сравнить цены', 'Оформить заказ'],
    done: 0,
    comments: 2,
  },
  {
    boardId: 'b-repair',
    status: 'waiting',
    title: 'Доставка ванны',
    description: 'Ремонт ванной: ванна оплачена, ждем доставку. Кто-то должен быть дома с 10 до 14.',
    assigneeIds: ['u-maria'],
    creatorId: ME,
    due: 1,
    subtasks: ['Оплатить заказ', 'Подтвердить время', 'Освободить проход', 'Проверить на сколы'],
    done: 2,
    comments: 4,
  },
  {
    boardId: 'b-repair',
    status: 'progress',
    title: 'Купить инструменты',
    description: 'Плиткорез, уровень, зубчатые шпатели и крестики для швов.',
    assigneeIds: [ME, 'u-ivan'],
    creatorId: 'u-ivan',
    due: 1,
    subtasks: ['Плиткорез', 'Уровень 120 см', 'Шпатели', 'Крестики 2 мм'],
    done: 1,
    comments: 3,
  },
  {
    boardId: 'b-repair',
    status: 'todo',
    title: 'Вызвать электрика',
    description: 'Перенести розетку и сделать отдельную линию под стиральную машину.',
    assigneeIds: ['u-dmitry'],
    creatorId: ME,
    due: 6,
    subtasks: ['Найти мастера по отзывам', 'Договориться о дате', 'Купить провод и автомат'],
    done: 0,
    comments: 1,
  },
  {
    boardId: 'b-repair',
    status: 'done',
    title: 'Выбрать дизайн',
    description: 'Подобрали цвет стен и плитки, сохранили картинки для мастера.',
    assigneeIds: ['u-maria'],
    creatorId: ME,
    due: -9,
    subtasks: ['Подборка картинок', 'Обсудить вместе', 'Финальный вариант'],
    done: 3,
    comments: 6,
  },
  {
    boardId: 'b-repair',
    status: 'done',
    title: 'Поменять розетки в коридоре',
    description: 'Старые розетки грелись, поставили новые с заземлением.',
    assigneeIds: ['u-dmitry'],
    creatorId: ME,
    due: -51,
    subtasks: ['Купить розетки', 'Отключить автомат', 'Поменять'],
    done: 3,
    comments: 2,
  },
  {
    boardId: 'b-repair',
    status: 'done',
    title: 'Заделать трещину на балконе',
    description: 'Трещина в стяжке у порога, залили ремонтной смесью.',
    assigneeIds: [ME, 'u-ivan'],
    creatorId: ME,
    due: -80,
    subtasks: ['Расшить трещину', 'Залить смесь'],
    done: 2,
    comments: 1,
  },

  {
    boardId: 'b-car',
    status: 'todo',
    title: 'Поменять резину на зимнюю',
    description: 'Записаться в шиномонтаж до первых заморозков.',
    assigneeIds: [ME],
    creatorId: ME,
    due: 2,
    subtasks: ['Записаться', 'Забрать колеса из гаража', 'Шиномонтаж', 'Сдать летние на хранение'],
    done: 0,
    comments: 2,
  },
  {
    boardId: 'b-car',
    status: 'progress',
    title: 'Плановое ТО',
    description: 'Замена масла и фильтров, проверка тормозов.',
    assigneeIds: ['u-dmitry', 'u-ivan'],
    creatorId: ME,
    due: 5,
    subtasks: ['Записаться в сервис', 'Масло и фильтры', 'Тормозные колодки', 'Оплатить'],
    done: 1,
    comments: 3,
  },
  {
    boardId: 'b-car',
    status: 'waiting',
    title: 'Скол на лобовом стекле',
    description: 'Скол заклеили, через неделю проверить, не пошла ли трещина.',
    assigneeIds: [ME],
    creatorId: 'u-dmitry',
    due: 7,
    subtasks: ['Заклеить скол', 'Проверить через неделю'],
    done: 1,
    comments: 2,
  },
  {
    boardId: 'b-car',
    status: 'todo',
    title: 'Продлить ОСАГО',
    description: 'Полис заканчивается в конце месяца, сравнить цены у страховых.',
    assigneeIds: [ME],
    creatorId: ME,
    due: 12,
    subtasks: ['Сравнить цены', 'Оформить онлайн', 'Распечатать полис'],
    done: 0,
  },
  {
    boardId: 'b-car',
    status: 'done',
    title: 'Поменять дворники',
    description: 'Поставили новые щетки, старые скрипели и оставляли разводы.',
    assigneeIds: [ME],
    creatorId: ME,
    due: -12,
    subtasks: ['Купить щетки', 'Поставить'],
    done: 2,
    comments: 1,
  },
  {
    boardId: 'b-car',
    status: 'done',
    title: 'Залить незамерзайку',
    description: 'Купили канистру зимней омывайки, одну залили, вторая в багажнике.',
    assigneeIds: ['u-dmitry'],
    creatorId: ME,
    due: -2,
    subtasks: ['Купить', 'Залить'],
    done: 2,
  },
  {
    boardId: 'b-car',
    status: 'done',
    title: 'Пройти техосмотр',
    description: 'Диагностическая карта до следующего года получена.',
    assigneeIds: [ME],
    creatorId: 'u-dmitry',
    due: -43,
    subtasks: ['Записаться', 'Пройти', 'Забрать карту'],
    done: 3,
    comments: 1,
  },
  {
    boardId: 'b-car',
    status: 'done',
    title: 'Заправить кондиционер',
    description: 'Перед поездкой на море кондиционер почти не холодил.',
    assigneeIds: ['u-dmitry'],
    creatorId: ME,
    due: -77,
    subtasks: ['Записаться', 'Заправка'],
    done: 2,
    comments: 2,
  },
]

const COMMENTS = [
  'Отлично, спасибо!',
  'Давай обсудим вечером.',
  'Фото в общем чате.',
  'Могу помочь в субботу.',
  'Цены выросли, может, поищем другой вариант?',
  'Договорились на завтра.',
  'Не забудь взять чек.',
  'Половина готова, остальное завтра.',
  'Можно перенести на выходные?',
  'Ссылка в общем чате.',
  'Все готово, проверяйте.',
  'Нужна еще одна поездка в магазин.',
  'Чек сохранен, скину вечером.',
  'Супер, так и сделаем!',
  'Напомни в пятницу, пожалуйста.',
  'Там скидка до конца недели.',
  'Заеду после работы.',
  'А может, сделать это в воскресенье?',
]

export function createSeedData(): WorkspaceData {
  const now = new Date()
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 3600 * 1000).toISOString()

  const tasks: Task[] = taskSeeds.map((seed, index) => {
    const id = `t-${index + 1}`
    const age = seed.due < -14 ? (5 - seed.due) * 24 : (3 + (index % 9)) * 24 + (index % 5) * 3
    const board = boards.find((item) => item.id === seed.boardId)
    const people = [seed.creatorId, ...seed.assigneeIds, ...(board?.memberIds ?? [])]
    const commentsCount = seed.comments ?? 0

    const comments = []
    for (let i = 0; i < commentsCount; i++) {
      comments.push({
        id: `${id}-m${i}`,
        authorId: people[(index + i * 2) % people.length],
        text: COMMENTS[(index * 3 + i * 5) % COMMENTS.length],
        createdAt: hoursAgo(age - ((i + 1) * age) / (commentsCount + 1)),
      })
    }

    return {
      id,
      boardId: seed.boardId,
      title: seed.title,
      description: seed.description,
      status: seed.status,
      assigneeIds: seed.assigneeIds,
      creatorId: seed.creatorId,
      dueDate: toDateKey(addDays(now, seed.due)),
      subtasks: seed.subtasks.map((text, i) => ({ id: `${id}-c${i}`, text, done: i < seed.done })),
      comments,
      createdAt: hoursAgo(age),
    }
  })

  const notifications: AppNotification[] = []

  tasks.forEach((task) => {
    const isMine = task.creatorId === ME || task.assigneeIds.includes(ME)
    if (!isMine) return

    if (task.assigneeIds.includes(ME) && task.creatorId !== ME) {
      notifications.push({
        id: `n-${task.id}`,
        type: 'assigned',
        actorId: task.creatorId,
        taskId: task.id,
        createdAt: task.createdAt,
        read: false,
      })
    }

    task.comments.forEach((comment) => {
      if (comment.authorId === ME) return
      notifications.push({
        id: `n-${comment.id}`,
        type: 'comment',
        actorId: comment.authorId,
        taskId: task.id,
        createdAt: comment.createdAt,
        read: false,
      })
    })
  })

  const newest = (type: AppNotification['type']) =>
    notifications
      .filter((notification) => notification.type === type)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 3)

  const latest = [...newest('assigned'), ...newest('comment')].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  latest.forEach((notification, index) => {
    notification.read = index > 2
  })

  return { users, boards, tasks, notifications: latest }
}
