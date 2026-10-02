export const cv = {
        name: 'Саша Шахнова',
        email: 'avhshakhnova@gmail.com',
        phone: '+7 910 089-08-57',
        github: 'https://github.com/suppukerr',
        telegram: 'https://t.me/tchepuxa',
        projects: [
            {
            id: 1,
            year: 2025,
            title: 'Сайт-портфолио, стилизованный под macOS 9.1',
            description: 'Сайт-портфолио, выполненный в стиле macOS 9.1 с использованием Vue.js',
            githubLink: 'https://github.com/suppukerr/web_cv'
          },
          {
            id: 2,
            year: 2025,
            title: 'Биллинг-сервис',
            description: 'Создание системы биллинга с интеграцией платежных систем',
            githubLink: 'https://github.com/suppukerr/graduate_work'
          },
          {
            id: 3,
            year: 2023,
            title: 'Проект Neo4j по представлению текста в графовом виде',
            description: 'Система визуализации и анализа текстовых данных с использованием графовых баз данных',
            githubLink: 'https://github.com/suppukerr/neo4j_project'
          },
          {
            id: 4,
            year: 2023,
            title: 'CondBERT for style transfer tasks',
            description: 'Проект по нейтрализации текста и переносу стилей в различных доменах',
            githubLink: 'https://github.com/suppukerr/CondBERT-project'
          },
          {
            id: 5,
            year: 2022,
            title: 'Поисковик с метриками BM-25 и BERT',
            description: 'Разработка поисковой системы в рамках курса по информационному поиску',
            githubLink: 'https://github.com/suppukerr/HW_infosearch'
          }
        ],
        experience: [
          {
            id: 1,
            dates: 'сентябрь 2023 - настоящее время',
            company: 'ООО ИТМ',
            title: 'Web-разработчик',
            position: 'Web-разработчик в отделе развития ИС управления ассортиментом',
            duties: [
              'Переписывала сервис на FastAPI',
              'Оптимизировала запросы к БД для высоконагруженной обработки документов из разных систем',    
              'Организовала потоковую передачу данных',
              'Создавала сервис авторизации и настраивала аутентификацию, включая oauth2.0',
              'Перенесла очереди из redis в rabbitmq',
              'Увеличила процента покрытия тестами до 80%',
              'Настраивала CI/CD проектов',
              'Разворачивала новый микросервис, настраивала его взаимодействие с остальными сервисами',
              'Совместно с аналитиками продумывала способы по оптимизации сервесов и улучшению пользовательского опыта'
            ]
          },
          {
            id: 2,
            dates: 'июль - август 2023',
            company: 'ООО ИТМ',
            title: 'Стажёр-разработчик',
            position: 'Стажёр-разработчик в отделе развития ИС управления ассортиментом',
            duties: [
              'Создание таблиц и витрин в Oracle и PostgreSQL',
              'Написание скриптов для миграции данных на PostgreSQL',
              'Разработка чат-бота на Python'
            ]
          }
        ],
        skills: ['Python', 'FastAPI', 'JavaScript', 'Vue.js', 'PostgreSQL', 'Oracle', 'OAuth2.0', 'CI/CD', 'Unit Testing', 'Git', 'Docker'],
        education: [
          {
            id: 1,
            degree: 'Компьютерная лингвистика',
            school: 'НИУ ВШЭ',
            year: '2019-2023'
          }
        ]
      }
