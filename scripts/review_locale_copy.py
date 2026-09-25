"""Reviewed domain terminology and primary journeys. Array order follows LOCALES."""
import json
from i18n_source import ROOT, LOCALES, inventory

COPY = {
    'Menos papéis.': ['Less paperwork.','Menos papeleo.','Moins de paperasse.','Weniger Papierkram.','Meno scartoffie.'],
    'Mais controlo sobre': ['More control over','Más control sobre','Plus de contrôle sur','Mehr Kontrolle über','Più controllo su'],
    'cada serviço.': ['every job.','cada trabajo.','chaque intervention.','jeden Auftrag.','ogni intervento.'],
    'OS em curso': ['Open work orders','Órdenes en curso','Ordres en cours','Offene Aufträge','Ordini in corso'],
    'Por receber': ['Outstanding payments','Pendiente de cobro','À encaisser','Offene Forderungen','Da incassare'],
    'Faturado este mês': ['Invoiced this month','Facturado este mes','Facturé ce mois-ci','Diesen Monat fakturiert','Fatturato questo mese'],
    '/mês por oficina': ['/month per workshop','/mes por taller','/mois par garage','/Monat pro Werkstatt','/mese per officina'],
    'O seu próximo cuidado': ['Your next appointment','Tu próxima cita','Votre prochain rendez-vous','Ihr nächster Termin','Il tuo prossimo appuntamento'],
    'começa aqui.': ['starts here.','empieza aquí.','commence ici.','beginnt hier.','inizia qui.'],
    'Corte e cuidado': ['Haircut and care','Corte y cuidado','Coupe et soin','Haarschnitt und Pflege','Taglio e cura'],
    'Sem cartão': ['No card required','Sin tarjeta','Sans carte bancaire','Keine Kreditkarte nötig','Senza carta'],
    'Computador e telemóvel': ['Desktop and mobile','Ordenador y móvil','Ordinateur et mobile','Computer und Smartphone','Computer e smartphone'],
    'Normalmente respondemos em 1 dia útil.': ['We usually respond within 1 working day.','Normalmente respondemos en 1 día laborable.','Nous répondons généralement sous 1 jour ouvré.','Wir antworten normalerweise innerhalb von 1 Werktag.','Di solito rispondiamo entro 1 giorno lavorativo.'],
    'Resposta habitual em 1 dia útil.': ['Usually within 1 working day.','Respuesta habitual en 1 día laborable.','Réponse habituelle sous 1 jour ouvré.','Antwort in der Regel innerhalb von 1 Werktag.','Risposta solitamente entro 1 giorno lavorativo.'],
    'Recebemos a sua mensagem e vamos responder com uma primeira leitura e um próximo passo concreto. Normalmente respondemos em 1 dia útil.': [
        'We have received your message and will reply with an initial assessment and a clear next step. We usually respond within 1 working day.',
        'Hemos recibido tu mensaje y responderemos con una primera valoración y un siguiente paso concreto. Normalmente respondemos en 1 día laborable.',
        'Nous avons reçu votre message et vous répondrons avec une première analyse et une prochaine étape concrète. Nous répondons généralement sous 1 jour ouvré.',
        'Wir haben Ihre Nachricht erhalten und antworten mit einer ersten Einschätzung und einem konkreten nächsten Schritt. Wir antworten normalerweise innerhalb von 1 Werktag.',
        'Abbiamo ricevuto il tuo messaggio e risponderemo con una prima valutazione e un prossimo passo concreto. Di solito rispondiamo entro 1 giorno lavorativo.'
    ],
    'Idioma': ['Language','Idioma','Langue','Sprache','Lingua'],
    'Sobre': ['About','Quiénes somos','À propos','Über uns','Chi siamo'],
    'Plano': ['Plan','Plan','Offre','Tarif','Piano'],
    'Plano Inicial': ['Starter plan','Plan inicial','Offre de départ','Starter-Tarif','Piano iniziale'],
    'Plano ajustado': ['A plan tailored','Un plan adaptado','Une offre adaptée','Ein passender Tarif','Un piano su misura'],
    'Para quem': ["Who it’s for",'Para quién','Pour qui','Für wen','Per chi'],
    'Recursos': ['Features','Funciones','Fonctionnalités','Funktionen','Funzionalità'],
    'Perguntas': ['FAQ','Preguntas','FAQ','FAQ','Domande'],
    'Soluções': ['Solutions','Soluciones','Solutions','Lösungen','Soluzioni'],
    'Contacto': ['Contact','Contacto','Contact','Kontakt','Contatti'],
    'Oficinas mecânicas': ['Vehicle repair workshops','Talleres mecánicos','Garages automobiles','Kfz-Werkstätten','Autofficine'],
    'Frotas TVDE': ['Ride-hailing fleets','Flotas VTC','Flottes VTC','Mietwagenflotten','Flotte NCC'],
    'Pedir proposta': ['Request a quote','Solicitar presupuesto','Demander un devis','Angebot anfordern','Richiedi un preventivo'],
    'Pedir diagnóstico': ['Discuss your project','Evaluar mi proyecto','Parlons de votre projet','Projekt besprechen','Parliamo del progetto'],
    'Pedir diagnóstico gratuito': ['Get a free consultation','Solicitar una consulta gratuita','Demander un premier échange gratuit','Kostenlose Erstberatung','Richiedi una consulenza gratuita'],
    'App de agendamento online': ['Online booking app','App de reservas online','Application de prise de rendez-vous en ligne','App für Online-Terminbuchungen','App di prenotazione online'],
    'Os seus clientes marcam online.': ['Your clients book online.','Tus clientes reservan online.','Vos clients réservent en ligne.','Ihre Kunden buchen online.','I tuoi clienti prenotano online.'],
    'A Áurea organiza a agenda.': ['Áurea keeps your calendar organised.','Áurea organiza tu agenda.','Áurea organise votre agenda.','Áurea organisiert Ihren Kalender.','Áurea organizza la tua agenda.'],
    'Uma aplicação para barbearias, salões e profissionais de beleza e bem-estar. Partilhe a sua página de marcações: o cliente escolhe o serviço, o profissional e um horário disponível. Você acompanha tudo numa só agenda.': [
        'An app for barbershops, salons, and beauty and wellness professionals. Share your booking page: clients choose a service, a professional and an available time. Manage everything in one calendar.',
        'Una app para barberías, salones y profesionales de belleza y bienestar. Comparte tu página de reservas: el cliente elige el servicio, el profesional y una hora disponible. Gestiona todo en una sola agenda.',
        'Une application pour les barbiers, salons et professionnels de la beauté et du bien-être. Partagez votre page de réservation : le client choisit la prestation, le professionnel et un créneau disponible. Retrouvez tout dans un seul agenda.',
        'Eine App für Barbershops, Salons sowie Beauty- und Wellness-Profis. Teilen Sie Ihre Buchungsseite: Kunden wählen eine Leistung, einen Mitarbeiter und einen freien Termin. Sie behalten alles in einem Kalender im Blick.',
        'Un’app per barbieri, saloni e professionisti della bellezza e del benessere. Condividi la tua pagina di prenotazione: il cliente sceglie il servizio, il professionista e un orario disponibile. Gestisci tutto in un’unica agenda.'
    ],
    'Agenda': ['Calendar','Agenda','Agenda','Kalender','Agenda'],
    'Agenda Clientes Serviços': ['Calendar · Clients · Services','Agenda · Clientes · Servicios','Agenda · Clients · Prestations','Kalender · Kunden · Leistungen','Agenda · Clienti · Servizi'],
    'Agenda completa': ['Complete scheduling','Agenda completa','Gestion complète des rendez-vous','Vollständige Terminverwaltung','Gestione completa degli appuntamenti'],
    'Agenda online': ['Online booking','Reservas online','Prise de rendez-vous en ligne','Online-Terminbuchung','Prenotazioni online'],
    'Agenda online para clientes': ['Online booking for clients','Reservas online para clientes','Réservation en ligne pour les clients','Online-Terminbuchung für Kunden','Prenotazione online per i clienti'],
    'Agenda online · Studio Aurora': ['Online booking · Studio Aurora','Reservas online · Studio Aurora','Réservation en ligne · Studio Aurora','Online-Buchung · Studio Aurora','Prenotazione online · Studio Aurora'],
    'Agenda e gestão para marcações': ['Online booking and scheduling','Reservas y gestión de citas','Réservation et gestion des rendez-vous','Buchung und Terminverwaltung','Prenotazione e gestione appuntamenti'],
    'Marcações': ['Appointments','Citas','Rendez-vous','Termine','Appuntamenti'],
    '+ Nova marcação': ['+ New appointment','+ Nueva cita','+ Nouveau rendez-vous','+ Neuer Termin','+ Nuovo appuntamento'],
    'A sua página de marcações.': ['Your own booking page.','Tu página de reservas.','Votre page de réservation.','Ihre eigene Buchungsseite.','La tua pagina di prenotazione.'],
    'O cliente marca. A sua agenda recebe.': ['Clients book. Your calendar updates.','El cliente reserva. Tu agenda se actualiza.','Le client réserve. Votre agenda se met à jour.','Kunden buchen. Ihr Kalender wird aktualisiert.','Il cliente prenota. La tua agenda si aggiorna.'],
    'O agendamento acontece online.': ['Booking happens online.','Las reservas se hacen online.','La prise de rendez-vous se fait en ligne.','Die Terminbuchung erfolgt online.','Le prenotazioni si fanno online.'],
    'O controlo fica consigo.': ['You stay in control.','Tú mantienes el control.','Vous gardez le contrôle.','Sie behalten die Kontrolle.','Il controllo resta a te.'],
    'Do pedido à marcação': ['From enquiry to booking','De la consulta a la reserva','De la demande au rendez-vous','Von der Anfrage zum Termin','Dalla richiesta alla prenotazione'],
    'A Áurea liga a página de marcações dos seus clientes à agenda de trabalho da sua equipa.': [
        'Áurea connects your client booking page to your team’s work calendar.',
        'Áurea conecta la página de reservas de tus clientes con la agenda de trabajo de tu equipo.',
        'Áurea relie la page de réservation de vos clients à l’agenda de travail de votre équipe.',
        'Áurea verbindet die Buchungsseite Ihrer Kunden mit dem Arbeitskalender Ihres Teams.',
        'Áurea collega la pagina di prenotazione dei tuoi clienti all’agenda di lavoro del tuo team.'
    ],
    'Partilhe a sua agenda': ['Share your booking page','Comparte tu página de reservas','Partagez votre page de réservation','Teilen Sie Ihre Buchungsseite','Condividi la tua pagina di prenotazione'],
    'Ver como funciona': ['See how it works','Ver cómo funciona','Découvrir le fonctionnement','So funktioniert es','Scopri come funziona'],
    'Confirmar marcação': ['Confirm booking','Confirmar reserva','Confirmer le rendez-vous','Termin bestätigen','Conferma prenotazione'],
    'Serviço': ['Service','Servicio','Prestation','Leistung','Servizio'],
    'Data e hora': ['Date and time','Fecha y hora','Date et heure','Datum und Uhrzeit','Data e ora'],
    'Confirmação': ['Confirmation','Confirmación','Confirmation','Bestätigung','Conferma'],
    'Escolha o dia e a hora': ['Choose a date and time','Elige el día y la hora','Choisissez le jour et l’heure','Wählen Sie Tag und Uhrzeit','Scegli il giorno e l’ora'],
    'SEG': ['MON','LUN','LUN','MO','LUN'],
    'TER': ['TUE','MAR','MAR','DI','MAR'],
    'QUA': ['WED','MIÉ','MER','MI','MER'],
    'QUI': ['THU','JUE','JEU','DO','GIO'],
    'SEX': ['FRI','VIE','VEN','FR','VEN'],
    'Pagamentos e sinais': ['Payments and deposits','Pagos y anticipos','Paiements et acomptes','Zahlungen und Anzahlungen','Pagamenti e acconti'],
    'Sinais online, regras por serviço, isenções por cliente e acompanhamento do estado do pagamento.': [
        'Online deposits, service-specific rules, client exemptions and payment status tracking.',
        'Anticipos online, reglas por servicio, exenciones por cliente y seguimiento del estado del pago.',
        'Acomptes en ligne, règles par prestation, exemptions par client et suivi des paiements.',
        'Online-Anzahlungen, Regeln je Leistung, Ausnahmen je Kunde und Nachverfolgung des Zahlungsstatus.',
        'Acconti online, regole per servizio, esenzioni per cliente e monitoraggio dello stato dei pagamenti.'
    ],
    'Duração, categoria, valor, percentagem de sinal e ativação de cada serviço.': [
        'Duration, category, price, deposit percentage and availability of each service.',
        'Duración, categoría, precio, porcentaje de anticipo y activación de cada servicio.',
        'Durée, catégorie, prix, pourcentage d’acompte et activation de chaque prestation.',
        'Dauer, Kategorie, Preis, Anzahlungsprozentsatz und Aktivierung jeder Leistung.',
        'Durata, categoria, prezzo, percentuale di acconto e attivazione di ogni servizio.'
    ],
    'Sim. Cada negócio recebe uma ligação de agenda própria com os serviços, profissionais, datas e horários disponíveis.': [
        'Yes. Each business gets its own booking link with available services, professionals, dates and times.',
        'Sí. Cada negocio recibe su propio enlace de reservas con los servicios, profesionales, fechas y horas disponibles.',
        'Oui. Chaque établissement dispose de son propre lien de réservation avec les prestations, professionnels, dates et créneaux disponibles.',
        'Ja. Jedes Unternehmen erhält einen eigenen Buchungslink mit verfügbaren Leistungen, Mitarbeitern, Daten und Uhrzeiten.',
        'Sì. Ogni attività riceve il proprio link di prenotazione con servizi, professionisti, date e orari disponibili.'
    ],
    'Experimentar a agenda': ['Try the booking app','Probar la app de reservas','Essayer l’application','Buchungs-App testen','Prova l’app di prenotazione'],
    'Bom dia, Oficina Central': ['Good morning, Oficina Central','Buenos días, Oficina Central','Bonjour, Oficina Central','Guten Morgen, Oficina Central','Buongiorno, Oficina Central'],
    '1. Responsável pelo tratamento': ['1. Data controller','1. Responsable del tratamiento','1. Responsable du traitement','1. Verantwortlicher für die Datenverarbeitung','1. Titolare del trattamento'],
    '7. Direitos dos titulares': ['7. Data subject rights','7. Derechos de los interesados','7. Droits des personnes concernées','7. Rechte der betroffenen Personen','7. Diritti degli interessati'],
    'O responsável pelo tratamento dos dados pessoais é a Lumisland, Portugal. Para pedidos relacionados com privacidade:': [
        'The controller of personal data is Lumisland, Portugal. For privacy-related requests:',
        'El responsable del tratamiento de datos personales es Lumisland, Portugal. Para solicitudes relacionadas con la privacidad:',
        'Le responsable du traitement des données personnelles est Lumisland, Portugal. Pour toute demande relative à la confidentialité :',
        'Verantwortlich für die Verarbeitung personenbezogener Daten ist Lumisland, Portugal. Für Datenschutzanfragen:',
        'Il titolare del trattamento dei dati personali è Lumisland, Portogallo. Per richieste relative alla privacy:'
    ],
    'Confirme que leu a política para enviar o pedido.': ['Confirm that you have read the policy before sending your request.','Confirma que has leído la política antes de enviar la solicitud.','Confirmez avoir lu la politique avant d’envoyer votre demande.','Bestätigen Sie, dass Sie die Richtlinie gelesen haben, bevor Sie Ihre Anfrage senden.','Conferma di aver letto l’informativa prima di inviare la richiesta.'],
    'Preencha o formulário. Entramos em contacto para preparar a conta e enviar o acesso ao teste de cinco dias.': [
        'Complete the form. We will contact you to set up your account and send access to the five-day trial.',
        'Rellena el formulario. Nos pondremos en contacto para preparar la cuenta y enviarte el acceso a la prueba de cinco días.',
        'Remplissez le formulaire. Nous vous contacterons pour préparer le compte et vous envoyer l’accès à l’essai de cinq jours.',
        'Füllen Sie das Formular aus. Wir kontaktieren Sie, um Ihr Konto einzurichten und Ihnen den Zugang zum fünftägigen Test zu senden.',
        'Compila il modulo. Ti contatteremo per preparare l’account e inviarti l’accesso alla prova di cinque giorni.'
    ],
}

def apply_review():
    sources = inventory()
    for index,locale in enumerate(LOCALES):
        path = ROOT/'locales'/f'{locale}.json'
        data = json.loads(path.read_text(encoding='utf-8'))
        for source,values in COPY.items():
            if source in sources: data[source] = values[index]
        # Product names stay stable, even inside translated titles and descriptions.
        for source,value in data.items():
            if 'Lumisland Oficina' in source:
                for variant in ['Lumisland Workshop','Lumisland Taller','Lumisland Werkstatt','Lumisland Atelier','Lumisland Officina']:
                    value = value.replace(variant,'Lumisland Oficina')
                data[source] = value
        path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

if __name__ == '__main__': apply_review()
