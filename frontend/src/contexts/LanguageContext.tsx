import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt';

interface Translations {
  [key: string]: {
    en: string;
    pt: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.discover': { en: 'Discover', pt: 'Descobrir' },
  'nav.stays': { en: 'Stays', pt: 'Estadias' },
  'nav.experiences': { en: 'Experiences', pt: 'Experiências' },
  'nav.cities': { en: 'Cities', pt: 'Cidades' },
  'nav.about': { en: 'About Angola', pt: 'Sobre Angola' },
  'nav.planTrip': { en: 'Plan Your Trip', pt: 'Planeie a Sua Viagem' },
  'nav.login': { en: 'Sign In', pt: 'Entrar' },
  'nav.register': { en: 'Sign Up', pt: 'Registar' },
  'nav.profile': { en: 'Profile', pt: 'Perfil' },
  'nav.favorites': { en: 'Favorites', pt: 'Favoritos' },
  'nav.bookings': { en: 'My Bookings', pt: 'Minhas Reservas' },
  'nav.logout': { en: 'Sign Out', pt: 'Sair' },
  'nav.admin': { en: 'Admin Dashboard', pt: 'Painel de Administração' },

  // Hero Section
  'hero.title': { en: 'Discover Angola Beyond the Guidebooks', pt: 'Descubra Angola Além dos Guias' },
  'hero.subtitle': { en: 'Explore trusted places to stay, must-see destinations and authentic local experiences.', pt: 'Explore lugares de confiança para ficar, destinos imperdíveis e experiências locais autênticas.' },
  'hero.searchPlaceholder': { en: 'Where do you want to go?', pt: 'Para onde quer ir?' },
  'hero.searchButton': { en: 'Search Destinations', pt: 'Pesquisar Destinos' },

  // Filters
  'filter.city': { en: 'City', pt: 'Cidade' },
  'filter.type': { en: 'Type', pt: 'Tipo' },
  'filter.dates': { en: 'Dates', pt: 'Datas' },
  'filter.all': { en: 'All', pt: 'Todos' },
  'filter.hotel': { en: 'Hotel', pt: 'Hotel' },
  'filter.lodge': { en: 'Lodge', pt: 'Lodge' },
  'filter.guesthouse': { en: 'Guesthouse', pt: 'Pensão' },
  'filter.attraction': { en: 'Attraction', pt: 'Atração' },
  'filter.experience': { en: 'Experience', pt: 'Experiência' },

  // Sections
  'section.featured': { en: 'Featured Destinations', pt: 'Destinos em Destaque' },
  'section.featuredSubtitle': { en: 'Discover the most breathtaking places Angola has to offer', pt: 'Descubra os lugares mais deslumbrantes que Angola tem para oferecer' },
  'section.stays': { en: 'Recommended Stays', pt: 'Estadias Recomendadas' },
  'section.staysSubtitle': { en: 'Handpicked accommodations for every traveler', pt: 'Alojamentos selecionados para cada viajante' },
  'section.experiences': { en: 'Experiences & Culture', pt: 'Experiências e Cultura' },
  'section.experiencesSubtitle': { en: 'Immerse yourself in authentic Angolan experiences', pt: 'Mergulhe em experiências angolanas autênticas' },
  'section.map': { en: 'Explore Angola', pt: 'Explore Angola' },
  'section.mapSubtitle': { en: 'Discover destinations across the country', pt: 'Descubra destinos por todo o país' },
  'section.trust': { en: 'Travel with Confidence', pt: 'Viaje com Confiança' },

  // Trust Section
  'trust.verified': { en: 'Verified Partners', pt: 'Parceiros Verificados' },
  'trust.verifiedDesc': { en: 'All our partners are carefully vetted for quality and reliability', pt: 'Todos os nossos parceiros são cuidadosamente verificados pela qualidade e fiabilidade' },
  'trust.safe': { en: 'Trusted Stays', pt: 'Estadias de Confiança' },
  'trust.safeDesc': { en: 'Every accommodation meets our high standards for comfort and safety', pt: 'Cada alojamento cumpre os nossos altos padrões de conforto e segurança' },
  'trust.local': { en: 'Local Insights', pt: 'Conhecimento Local' },
  'trust.localDesc': { en: 'Get authentic recommendations from people who know Angola best', pt: 'Obtenha recomendações autênticas de pessoas que conhecem Angola melhor' },
  'trust.support': { en: '24/7 Support', pt: 'Suporte 24/7' },
  'trust.supportDesc': { en: 'Our team is here to help you at every step of your journey', pt: 'A nossa equipa está aqui para ajudá-lo em cada passo da sua viagem' },

  // Cards
  'card.explore': { en: 'Explore', pt: 'Explorar' },
  'card.viewDetails': { en: 'View Details', pt: 'Ver Detalhes' },
  'card.perNight': { en: 'per night', pt: 'por noite' },
  'card.duration': { en: 'Duration', pt: 'Duração' },
  'card.hours': { en: 'hours', pt: 'horas' },
  'card.reviews': { en: 'reviews', pt: 'avaliações' },

  // Footer
  'footer.tagline': { en: 'Discover the beauty of Angola', pt: 'Descubra a beleza de Angola' },
  'footer.company': { en: 'Company', pt: 'Empresa' },
  'footer.aboutUs': { en: 'About Us', pt: 'Sobre Nós' },
  'footer.contact': { en: 'Contact', pt: 'Contacto' },
  'footer.careers': { en: 'Careers', pt: 'Carreiras' },
  'footer.support': { en: 'Support', pt: 'Suporte' },
  'footer.helpCenter': { en: 'Help Center', pt: 'Centro de Ajuda' },
  'footer.safety': { en: 'Safety Info', pt: 'Informações de Segurança' },
  'footer.terms': { en: 'Terms of Service', pt: 'Termos de Serviço' },
  'footer.privacy': { en: 'Privacy Policy', pt: 'Política de Privacidade' },
  'footer.legal': { en: 'Legal', pt: 'Legal' },
  'footer.rights': { en: 'All rights reserved.', pt: 'Todos os direitos reservados.' },

  // Auth
  'auth.email': { en: 'Email', pt: 'Email' },
  'auth.password': { en: 'Password', pt: 'Palavra-passe' },
  'auth.fullName': { en: 'Full Name', pt: 'Nome Completo' },
  'auth.signIn': { en: 'Sign In', pt: 'Entrar' },
  'auth.signUp': { en: 'Create Account', pt: 'Criar Conta' },
  'auth.forgotPassword': { en: 'Forgot password?', pt: 'Esqueceu a palavra-passe?' },
  'auth.noAccount': { en: "Don't have an account?", pt: 'Não tem conta?' },
  'auth.hasAccount': { en: 'Already have an account?', pt: 'Já tem conta?' },
  'auth.welcome': { en: 'Welcome back', pt: 'Bem-vindo de volta' },
  'auth.createAccount': { en: 'Create your account', pt: 'Crie a sua conta' },
  'auth.welcomeSubtitle': { en: 'Sign in to access your bookings and favorites', pt: 'Entre para aceder às suas reservas e favoritos' },
  'auth.createSubtitle': { en: 'Join us to discover the best of Angola', pt: 'Junte-se a nós para descobrir o melhor de Angola' },

  // Common
  'common.loading': { en: 'Loading...', pt: 'A carregar...' },
  'common.error': { en: 'Something went wrong', pt: 'Algo correu mal' },
  'common.save': { en: 'Save', pt: 'Guardar' },
  'common.cancel': { en: 'Cancel', pt: 'Cancelar' },
  'common.delete': { en: 'Delete', pt: 'Eliminar' },
  'common.edit': { en: 'Edit', pt: 'Editar' },
  'common.add': { en: 'Add', pt: 'Adicionar' },
  'common.search': { en: 'Search', pt: 'Pesquisar' },
  'common.filter': { en: 'Filter', pt: 'Filtrar' },
  'common.sort': { en: 'Sort', pt: 'Ordenar' },
  'common.viewAll': { en: 'View All', pt: 'Ver Todos' },
  'common.bookNow': { en: 'Book Now', pt: 'Reservar Agora' },
  'common.from': { en: 'From', pt: 'Desde' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kamba-language');
      return (saved as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('kamba-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
