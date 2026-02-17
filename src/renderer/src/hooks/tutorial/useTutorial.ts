import { driver, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useRef } from 'react'

// Tipos de páginas disponíveis para tutorial
export type TutorialPage =
  | 'sidebar'
  | 'dashboard'
  | 'reunionManager'
  | 'reunion'
  | 'prontuarioManager'
  | 'unityManager'
  | 'settings'

// Função para criar instância do driver com configurações padrão
const createDriver = () => {
  return driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(0, 0, 0, 0.7)',
    stagePadding: 8,
    stageRadius: 8,
    popoverClass: 'tutorial-popover',
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
    progressText: '{{current}} de {{total}}'
  })
}

// Passos do tutorial para a Sidebar
const sidebarSteps: DriveStep[] = [
  {
    element: '#sidebar-logo',
    popover: {
      title: 'Bem-vindo! 👋',
      description:
        'Este é o Sistema de Gestão da Obra da Piedade. Vamos fazer um tour rápido pelas principais funcionalidades.',
      side: 'right',
      align: 'start'
    }
  },
  {
    element: '#sidebar-theme-toggle',
    popover: {
      title: 'Tema do Sistema',
      description: 'Alterne entre tema claro e escuro conforme sua preferência.',
      side: 'right',
      align: 'center'
    }
  },
  {
    element: '#sidebar-nav-dashboard',
    popover: {
      title: 'Dashboard',
      description: 'Visualize estatísticas e gráficos sobre atendimentos e reuniões.',
      side: 'right',
      align: 'center'
    }
  },
  {
    element: '#sidebar-nav-reunioes',
    popover: {
      title: 'Reuniões',
      description: 'Gerencie suas reuniões: crie, edite e acompanhe o status de cada uma.',
      side: 'right',
      align: 'center'
    }
  },
  {
    element: '#sidebar-nav-prontuarios',
    popover: {
      title: 'Prontuários',
      description: 'Cadastre e visualize prontuários de atendimento.',
      side: 'right',
      align: 'center'
    }
  },
  {
    element: '#sidebar-nav-unidades',
    popover: {
      title: 'Unidades',
      description: 'Configure as unidades de atendimento disponíveis.',
      side: 'right',
      align: 'center'
    }
  },
  {
    element: '#sidebar-nav-configuracoes',
    popover: {
      title: 'Configurações',
      description: 'Ajuste as configurações do sistema, como local de armazenamento.',
      side: 'right',
      align: 'center'
    }
  },
  {
    element: '#sidebar-tutorial-btn',
    popover: {
      title: 'Ajuda',
      description:
        'Clique aqui a qualquer momento para iniciar o tutorial novamente ou ver ajuda da página atual.',
      side: 'right',
      align: 'center'
    }
  }
]

// Passos do tutorial para o Dashboard
const dashboardSteps: DriveStep[] = [
  {
    element: '#dashboard-header',
    popover: {
      title: 'Dashboard',
      description: 'Aqui você tem uma visão geral de todas as métricas do sistema.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#dashboard-atendimentos-chart',
    popover: {
      title: 'Atendimentos por Unidade',
      description: 'Este gráfico mostra a distribuição de atendimentos entre as unidades.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#dashboard-historico-chart',
    popover: {
      title: 'Histórico de Atendimentos',
      description: 'Acompanhe a evolução dos atendimentos ao longo do tempo.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#dashboard-tipos-chart',
    popover: {
      title: 'Tipos de Atendimento',
      description: 'Veja a distribuição percentual por tipo de atendimento.',
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '#dashboard-heatmap',
    popover: {
      title: 'Mapa de Calor',
      description: 'Identifique padrões de dias e horários mais movimentados.',
      side: 'top',
      align: 'center'
    }
  }
]

// Passos do tutorial para ReunionManager
const reunionManagerSteps: DriveStep[] = [
  {
    element: '#reunioes-header',
    popover: {
      title: 'Gerenciamento de Reuniões',
      description: 'Nesta página você gerencia todas as reuniões do sistema.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#reunioes-add-btn',
    popover: {
      title: 'Nova Reunião',
      description: 'Clique aqui para criar uma nova reunião.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#reunioes-search',
    popover: {
      title: 'Buscar Reunião',
      description: 'Pesquise reuniões pelo nome.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#reunioes-filters',
    popover: {
      title: 'Filtros',
      description: 'Filtre as reuniões por data de início, data fim e status.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#reunioes-table',
    popover: {
      title: 'Lista de Reuniões',
      description:
        'Clique em uma reunião para ver detalhes. Clique duas vezes para acessar os atendimentos.',
      side: 'top',
      align: 'center'
    }
  }
]

// Passos do tutorial para Reunion (Atendimentos)
const reunionSteps: DriveStep[] = [
  {
    element: '#reunion-header',
    popover: {
      title: 'Reunião Atual',
      description: 'Informações da reunião selecionada: nome, data e status.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#reunion-search',
    popover: {
      title: 'Buscar Prontuário',
      description: 'Digite o número ou selecione um prontuário para registrar um atendimento.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#reunion-add-btn',
    popover: {
      title: 'Novo Atendimento',
      description: 'Após selecionar um prontuário, clique aqui para adicionar o atendimento.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#reunion-table',
    popover: {
      title: 'Atendimentos Registrados',
      description: 'Lista de todos os atendimentos desta reunião. Use as ações para editar ou excluir.',
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '#reunion-summary',
    popover: {
      title: 'Resumo da Reunião',
      description: 'Acompanhe os totais: atendimentos, cestas e valores.',
      side: 'top',
      align: 'center'
    }
  }
]

// Passos do tutorial para ProntuarioManager
const prontuarioManagerSteps: DriveStep[] = [
  {
    element: '#prontuarios-header',
    popover: {
      title: 'Gerenciamento de Prontuários',
      description: 'Cadastre e gerencie prontuários de atendimento.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#prontuarios-add-btn',
    popover: {
      title: 'Novo Prontuário',
      description: 'Clique para cadastrar um novo prontuário.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#prontuarios-search',
    popover: {
      title: 'Buscar Prontuário',
      description: 'Pesquise por número ou nome do prontuário.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#prontuarios-table',
    popover: {
      title: 'Lista de Prontuários',
      description: 'Clique para ver detalhes ou use as ações para editar/excluir.',
      side: 'top',
      align: 'center'
    }
  }
]

// Passos do tutorial para UnityManager
const unityManagerSteps: DriveStep[] = [
  {
    element: '#unidades-header',
    popover: {
      title: 'Gerenciamento de Unidades',
      description: 'Configure as unidades de atendimento do sistema.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#unidades-add-btn',
    popover: {
      title: 'Nova Unidade',
      description: 'Clique para cadastrar uma nova unidade.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#unidades-search',
    popover: {
      title: 'Buscar Unidade',
      description: 'Pesquise unidades pelo nome.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#unidades-table',
    popover: {
      title: 'Lista de Unidades',
      description: 'Clique em uma unidade para ver detalhes ou editar.',
      side: 'top',
      align: 'center'
    }
  }
]

// Passos do tutorial para Settings
const settingsSteps: DriveStep[] = [
  {
    element: '#settings-header',
    popover: {
      title: 'Configurações do Sistema',
      description: 'Ajuste as configurações da aplicação.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#settings-db-path',
    popover: {
      title: 'Armazenamento de Dados',
      description:
        'Configure o local onde o banco de dados será armazenado. Útil para sincronização entre computadores.',
      side: 'bottom',
      align: 'center'
    }
  }
]

// Mapa de passos por página
const tutorialStepsMap: Record<TutorialPage, DriveStep[]> = {
  sidebar: sidebarSteps,
  dashboard: dashboardSteps,
  reunionManager: reunionManagerSteps,
  reunion: reunionSteps,
  prontuarioManager: prontuarioManagerSteps,
  unityManager: unityManagerSteps,
  settings: settingsSteps
}

  // Chave para localStorage
const TUTORIAL_SEEN_KEY = 'tutorial_seen'

// Importar o tipo Driver se disponível, ou usar any se não for exportado
// Assumindo que driver returns an object with destroy() and drive()
type DriverInstance = ReturnType<typeof createDriver>

export const useTutorial = () => {
  const activeDriverRef = useRef<DriverInstance | null>(null)

  // Verifica se o tutorial já foi visto
  const hasSeenTutorial = (page?: TutorialPage): boolean => {
    const seen = localStorage.getItem(TUTORIAL_SEEN_KEY)
    if (!seen) return false
    const seenPages = JSON.parse(seen) as string[]
    if (page) {
      return seenPages.includes(page)
    }
    return seenPages.length > 0
  }

  // Marca o tutorial como visto
  const markTutorialAsSeen = (page: TutorialPage): void => {
    const seen = localStorage.getItem(TUTORIAL_SEEN_KEY)
    const seenPages = seen ? (JSON.parse(seen) as string[]) : []
    if (!seenPages.includes(page)) {
      seenPages.push(page)
      localStorage.setItem(TUTORIAL_SEEN_KEY, JSON.stringify(seenPages))
    }
  }

  // Função auxiliar para limpar e destruir o driver ativo
  const destroyActiveDriver = () => {
    if (activeDriverRef.current) {
      const driver = activeDriverRef.current
      // Remove a referência antes de destruir para evitar que o callback
      // onDestroyStarted pense que ainda é o driver ativo e marque como visto
      activeDriverRef.current = null
      driver.destroy()
    }
  }

  // Inicia o tutorial para uma página específica
  const startTutorial = (page: TutorialPage): void => {
    const steps = tutorialStepsMap[page]
    if (!steps || steps.length === 0) return

    destroyActiveDriver()

    const driverInstance = createDriver()
    driverInstance.setSteps(steps)
    activeDriverRef.current = driverInstance

    // Marca como visto ao concluir
    driverInstance.setConfig({
      ...driverInstance.getConfig(),
      onDestroyStarted: () => {
        // Se o driver que está sendo destruído é o atual, marcamos como visto e limpamos a ref
        if (activeDriverRef.current === driverInstance) {
          markTutorialAsSeen(page)
          driverInstance.destroy()
          activeDriverRef.current = null
        }
      }
    })

    driverInstance.drive()
  }

  // Inicia tutorial completo (sidebar + página atual)
  const startFullTutorial = (currentPage?: TutorialPage): void => {
    destroyActiveDriver()

    const sidebarDriver = createDriver()
    const sidebarStepsToUse = tutorialStepsMap.sidebar

    sidebarDriver.setSteps(sidebarStepsToUse)
    activeDriverRef.current = sidebarDriver

    sidebarDriver.setConfig({
      ...sidebarDriver.getConfig(),
      onDestroyStarted: () => {
        if (activeDriverRef.current === sidebarDriver) {
          markTutorialAsSeen('sidebar')
          sidebarDriver.destroy()
          activeDriverRef.current = null

          // Se há uma página atual, inicia o tutorial dela
          // Usamos setTimeout para garantir que a UI limpou e o próximo driver pode iniciar limpo
          if (currentPage && currentPage !== 'sidebar') {
            setTimeout(() => {
              startTutorial(currentPage)
            }, 300)
          }
        }
      }
    })

    sidebarDriver.drive()
  }

  // Reseta o estado de "visto" para permitir ver novamente
  const resetTutorial = (): void => {
    localStorage.removeItem(TUTORIAL_SEEN_KEY)
  }

  return {
    hasSeenTutorial,
    startTutorial,
    startFullTutorial,
    markTutorialAsSeen,
    resetTutorial
  }
}

