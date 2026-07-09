import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/useGameStore'
import type { ScreenId } from './types'

import HomeScreen from './components/screens/HomeScreen'
import ProfileScreen from './components/screens/ProfileScreen'
import ThemeSelectorScreen from './components/screens/ThemeSelectorScreen'
import PlacementAdventureScreen from './components/screens/PlacementAdventureScreen'
import MissionMapScreen from './components/screens/MissionMapScreen'
import ReadingChallengeScreen from './components/screens/ReadingChallengeScreen'
import MathChallengeScreen from './components/screens/MathChallengeScreen'
import BonusGameScreen from './components/screens/BonusGameScreen'
import RewardChestScreen from './components/screens/RewardChestScreen'
import CertificateScreen from './components/screens/CertificateScreen'
import ParentDashboardScreen from './components/screens/ParentDashboardScreen'
import SettingsScreen from './components/screens/SettingsScreen'

const SCREEN_MAP: Record<ScreenId, React.ComponentType> = {
  home: HomeScreen,
  profile: ProfileScreen,
  'theme-select': ThemeSelectorScreen,
  placement: PlacementAdventureScreen,
  'mission-map': MissionMapScreen,
  'reading-challenge': ReadingChallengeScreen,
  'math-challenge': MathChallengeScreen,
  'bonus-game': BonusGameScreen,
  'reward-chest': RewardChestScreen,
  certificate: CertificateScreen,
  'parent-dashboard': ParentDashboardScreen,
  settings: SettingsScreen,
}

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const ScreenComponent = SCREEN_MAP[screen] ?? HomeScreen

  return (
    <div className="min-h-screen w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ScreenComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
