---
title: Von Webflow zum selbst gehosteten CMS-Portfolio
slug: von-webflow-zum-selbst-gehosteten-cms-portfolio
translation_id: blog-from-webflow-to-self-hosted-cms-portfolio
published_date: 2026-08-10
status: Published
featured: true
category: Webentwicklung
tags:
  - Webflow
  - Eleventy
  - Pages CMS
  - GitHub Actions
  - Hostinger
  - CI/CD
short_description: Wie mein Webflow-Portfolio mit Eleventy, Pages CMS, GitHub Actions und automatisierter Bereitstellung bei Hostinger zur selbst gehosteten CMS-Plattform wurde.
featured_image: /images/Featured-image-Portfolio-p-1080.png
featured_image_alt: Persönliche Portfolio-Website, die von Webflow zu einer selbst gehosteten CMS-Plattform weiterentwickelt wurde
author: Igor Mihajlovski
article_content: |-
  Als ich mein Portfolio ursprünglich erstellte, war das Ziel klar: eine moderne, professionelle Website, auf der ich meine Projekte, Leistungen und Erfahrungen in der Webentwicklung präsentieren konnte.

  Der Entwurf entstand zunächst in Figma, anschließend wurde die vollständige Website in Webflow entwickelt.

  Zu diesem Zeitpunkt war Webflow eine ausgezeichnete Lösung. Damit konnte ich das Design relativ schnell in eine vollständig responsive Website übertragen, Interaktionen und Animationen ergänzen und ein produktionsreifes Portfolio veröffentlichen, ohne ein komplettes System von Grund auf entwickeln zu müssen.

  Mit dem Wachstum des Portfolios änderten sich jedoch die Anforderungen.

  Ich benötigte nicht länger nur ein visuell ausgereiftes statisches Portfolio. Ich wollte Hosting und Quellcode selbst verwalten, ausführliche Fallstudien über ein CMS veröffentlichen, Templates wiederverwenden, Inhalte unter Versionskontrolle halten und jede Änderung automatisch in der Produktionsumgebung bereitstellen.

  So entwickelte sich ein vergleichsweise einfaches Webflow-Portfolio nach und nach zu einer kleinen, selbst gehosteten Content-Plattform.

  ## Phase 1 — Design und Entwicklung in Webflow

  Die erste Version des Portfolios war ein klassisches Projekt vom Design bis zur Umsetzung in Webflow.

  Zunächst definierte ich das vollständige UI/UX in Figma: die visuelle Ausrichtung, Typografie, Farben, Abstände, Seitenstruktur und die Darstellung der Projekte.

  Anschließend setzte ich das Design in Webflow um.

  Responsives Verhalten war ein wichtiger Teil des Entwicklungsprozesses. Das Desktop-Design wurde nicht einfach für kleinere Geräte verkleinert. Layouts, Typografie, Abstände und einzelne Komponenten wurden gezielt für Tablet- und Mobile-Breakpoints angepasst.

  Mit Webflow ließen sich außerdem Interaktionen und Animationen umsetzen, ohne den Frontend-Code unnötig zu verkomplizieren.

  Das Ergebnis war ein vollständig funktionsfähiges Portfolio mit einer klaren visuellen Identität.

  Genau das wurde später wichtig.

  Als ich mich schließlich für die Migration der Website entschied, gab es keinen Grund, ein bereits gut funktionierendes Frontend neu aufzubauen.

  Das Ziel war keine Neugestaltung des Portfolios.

  Das Ziel war, **das Funktionierende zu bewahren und die dahinterliegende Infrastruktur zu verändern.**

  ## Phase 2 — Vom Webflow-Hosting zum selbst gehosteten Betrieb

  Mit der Zeit wurde deutlich, dass das produktive Portfolio nicht länger an das Hosting von Webflow gebunden sein musste.

  Ich exportierte das Webflow-Projekt und überführte das vollständige Frontend in eine lokale Entwicklungsumgebung.

  Dabei blieben folgende Bestandteile erhalten:

  - HTML-Struktur
  - CSS
  - JavaScript
  - Bilder und weitere Assets
  - Animationen
  - responsives Verhalten
  - bestehende Frontend-Funktionen

  Statt alles neu zu entwickeln, wurde die exportierte Webflow-Website zur Grundlage des neuen, selbst gehosteten Projekts.

  Anschließend wurde die Website bei Hostinger bereitgestellt.

  Dadurch erhielt ich direkte Kontrolle über die Produktionsdateien, die Hosting-Umgebung und die zukünftige Weiterentwicklung der Website.

  ## Das Webflow-Formular-Backend ersetzen

  Mit dem Wechsel vom Webflow-Hosting konnte sich auch das Kontaktformular nicht länger auf die Formularverarbeitung von Webflow stützen.

  Ich ersetzte diese Funktion durch einen eigenen PHP-Endpunkt.

  Das Frontend fängt das Absenden des Formulars ab und sendet die Daten an den Server. Der PHP-Endpunkt verarbeitet die Anfrage und gibt eine JSON-Antwort zurück. Anschließend zeigt die Benutzeroberfläche den passenden Erfolgs- oder Fehlerstatus an.

  Zum Schutz vor Bots und Spam integrierte ich Cloudflare Turnstile.

  Dadurch funktioniert das Kontaktformular unabhängig von der Webflow-Infrastruktur, während die ursprüngliche Nutzererfahrung und das Design erhalten bleiben.

  ## Phase 3 — Von der statischen Website zur CMS-basierten Plattform

  Das selbst gehostete System löste die Infrastrukturfrage, doch eine weitere Frage blieb offen:

  **Wie sollten neue Fallstudien hinzugefügt werden?**

  Die einfachste Lösung wäre gewesen, bei jedem neuen Projekt eine bestehende HTML-Seite zu duplizieren.

  Technisch hätte das funktioniert.

  Langfristig wären dadurch jedoch doppeltes Markup, wiederkehrender Pflegeaufwand und das Risiko entstanden, dass sich einzelne Fallstudienseiten allmählich voneinander unterscheiden.

  Ich wollte die Inhalte von ihrer Darstellung trennen.

  Das führte zur Einführung eines Static-Site-Generators.

  ## Eleventy als Static-Site-Generator

  Ich integrierte Eleventy (11ty) in das Projekt.

  Mit Eleventy bleiben Inhalte von den HTML-Templates getrennt, während beim Build die fertigen statischen Seiten erzeugt werden.

  Für die Projektfallstudien erstellte ich ein wiederverwendbares Nunjucks-Template.

  Statt für jedes Projekt eine vollständige HTML-Seite zu pflegen, enthält jede Fallstudie eigene strukturierte Daten und Inhalte.

  Dazu gehören beispielsweise:

  - Projekttitel und Kategorie
  - Projektstatus
  - Kurzbeschreibung
  - Hero-Inhalte
  - Projektinformationen
  - Herausforderung und Ziele
  - Rollen und Verantwortlichkeiten
  - Entwicklungsprozess
  - Technologie-Stack
  - Integrationen
  - zentrale Funktionen
  - Lieferumfang
  - Ergebnisse
  - gewonnene Erkenntnisse
  - Projektgalerie
  - Projektlinks
  - SEO-Metadaten

  Ein einziges wiederverwendbares Template verwandelt diese strukturierten Inhalte in eine vollständige Fallstudienseite.

  Das bringt einen wichtigen Vorteil für die Pflege.

  Wenn sich das Design der Fallstudien zukünftig ändern soll, muss ich nicht jedes Projekt einzeln bearbeiten.

  Ich aktualisiere das Template nur einmal.

  ## Markdown als Inhaltsebene

  Jedes Projekt wird als Markdown-Datei gespeichert.

  Dadurch erhält das Portfolio eine einfache Inhaltsebene, ohne eine klassische Datenbank zu benötigen.

  Für diese Art von Website ist das eine bewusste Architekturentscheidung.

  Das Portfolio benötigt weder Benutzerkonten noch komplexe relationale Daten oder Inhalte, die sich täglich tausendfach ändern.

  Eine Datenbank und ein vollständiges Backend nur zur Verwaltung von Portfolio-Inhalten würden zusätzliche Komplexität schaffen, ohne ein tatsächliches Problem zu lösen.

  Markdown genügt.

  Markdown und Front Matter manuell zu bearbeiten, ist jedoch kein idealer Veröffentlichungsworkflow.

  An dieser Stelle kommt Pages CMS ins Spiel.

  ## Pages CMS — Inhalte visuell verwalten

  Das GitHub-Repository ist mit Pages CMS verbunden.

  Statt Markdown-Dateien manuell zu öffnen und Front Matter zu bearbeiten, kann ich die Inhalte über eine strukturierte CMS-Oberfläche verwalten.

  Für Projektfallstudien stellt das CMS Felder für Projekttitel, Kategorie, Titelbild, Leistungen, Technologien, Projektinformationen, Ziele, Verantwortlichkeiten, Technologie-Stack, Galerie, SEO-Daten und die weiteren vom Fallstudien-Template verwendeten Bereiche bereit.

  Projekte können außerdem für die Anzeige auf der Startseite markiert werden.

  Beim Speichern erstellt oder aktualisiert Pages CMS die zugehörige Markdown-Datei direkt im GitHub-Repository.

  Mit anderen Worten:

  **Das CMS ist keine separate Datenbank. Das Git-Repository bleibt die maßgebliche Quelle.**

  Dadurch verfügen Inhaltsänderungen automatisch über eine Versionshistorie.

  Jede Aktualisierung im CMS wird zu einem Git-Commit.

  ## GitHub als Zentrum des Veröffentlichungsworkflows

  Zu diesem Zeitpunkt sah die Architektur ungefähr so aus:

  **Pages CMS → Markdown → GitHub → Eleventy → statisches HTML**

  Ein Schritt fehlte noch.

  Das Deployment.

  Ich hätte den Build lokal ausführen, die generierten Dateien übernehmen und manuell zu Hostinger hochladen können.

  Für gelegentliche Änderungen wäre das vertretbar.

  Bei einer CMS-basierten Website erzeugt es jedoch unnötige Reibung.

  Wenn sich Inhalte über einen Browser aktualisieren lassen, sollte es nicht erforderlich sein, das lokale Projekt nur zur Veröffentlichung dieser Änderung zu öffnen.

  Deshalb automatisierte ich den Bereitstellungsprozess.

  ## Automatisierte Bereitstellung mit GitHub Actions und Hostinger

  Ein GitHub-Actions-Workflow reagiert jetzt auf Änderungen im `main`-Branch.

  Bei jedem neuen Commit führt der Workflow automatisch folgende Schritte aus:

  1. Repository auschecken
  2. Node.js-Umgebung vorbereiten
  3. erforderliche Abhängigkeiten installieren
  4. Eleventy-Produktionsbuild ausführen
  5. finale `_dist`-Ausgabe erzeugen
  6. Produktionsdateien bei Hostinger bereitstellen

  Für die Bereitstellung wird ein eigenes FTP-Konto verwendet, dessen Zugriff auf das Produktionsverzeichnis der Portfolio-Website beschränkt ist.

  Zugangsdaten werden nicht im Repository gespeichert. Sie sind sicher als GitHub Actions Secrets hinterlegt.

  Der vollständige Veröffentlichungsworkflow lautet nun:

  **Pages CMS → GitHub-Commit → GitHub Actions → Eleventy-Build → FTP → Hostinger → Live-Website**

  Für die Veröffentlichung neuer Inhalte ist kein manueller Upload in die Produktionsumgebung mehr erforderlich.

  Ich aktualisiere die Inhalte im CMS.

  Ich klicke auf Speichern.

  Der Rest geschieht automatisch.

  ## Warum FTP statt SSH?

  Ursprünglich war eine Bereitstellung über SSH geplant.

  Theoretisch könnte der GitHub-Actions-Workflow die Website erstellen und die generierten Dateien über eine SSH-Verbindung direkt auf den Server übertragen.

  In dieser konkreten Shared-Hosting-Umgebung erwies sich die direkte SSH-Bereitstellung von einem GitHub-Actions-Runner jedoch nicht als zuverlässigste Lösung.

  Statt zusätzliche Infrastrukturkomplexität einzuführen, nur um am ursprünglichen technischen Plan festzuhalten, passte ich die Bereitstellungsmethode an die Umgebung an.

  Dafür wurde ein eigenes FTP-Konto eingerichtet, dessen Zugriff auf das entsprechende Produktionsverzeichnis beschränkt ist. Anschließend stellte ich den Workflow auf FTP-Deployment um.

  Das erinnert daran, dass die beste technische Lösung nicht zwangsläufig diejenige ist, die in einem Architekturdiagramm am modernsten aussieht.

  Besser ist die Lösung, die das tatsächliche Problem zuverlässig löst.

  ## Projekte und Blog voneinander trennen

  Mit der Weiterentwicklung der Content-Architektur wurde eine weitere strukturelle Verbesserung sinnvoll.

  Anfangs verwendete die Fallstudienübersicht die Route `/blog/`. Das funktionierte, solange die Website lediglich einen Ort für ausführliche Projektinhalte benötigte. Allerdings verwischte dadurch die Grenze zwischen Portfolio-Projekten und redaktionellen Artikeln.

  Die Architektur behandelt beide heute als unabhängige Content-Systeme.

  Projektfallstudien befinden sich unter:

  `/projects/`

  Jedes Projekt besitzt eine eigene URL:

  `/projects/<project-slug>/`

  Projekte verwenden eine eigene Pages-CMS-Collection, ein strukturiertes Projektschema, eine Eleventy-Collection und ein wiederverwendbares Fallstudien-Template.

  Der eigentliche Blog befindet sich jetzt unter:

  `/blog/`

  Blogartikel verwenden eine separate Pages-CMS-Collection, ein eigenes Verzeichnis für Markdown-Inhalte, eine eigene Eleventy-Collection und ein wiederverwendbares Template für lange Artikel.

  Diese Trennung macht das Content-Modell wesentlich klarer:

  **Projekte belegen die geleistete Arbeit. Blogartikel erläutern die Ideen, Entscheidungen, Prozesse und Erkenntnisse dahinter.**

  Beide Systeme können aufeinander verweisen, ohne eng miteinander gekoppelt zu sein.

  Dieser Artikel erläutert beispielsweise die Architektur und den Migrationsprozess, während sich die zugehörige Projektseite als Fallstudie auf das Portfolio selbst konzentrieren kann.

  ## Automatisch erzeugte Projektübersichten

  Strukturierte Inhalte sind nicht nur für einzelne Fallstudienseiten nützlich.

  Eleventy verwendet die Projektdaten auch, um die Projektübersicht automatisch zu erzeugen.

  Wenn über das CMS ein neues Projekt hinzugefügt wird, kann die Website dessen Karte, URL und Fallstudienseite erzeugen, ohne dass eine weitere HTML-Seite manuell erstellt werden muss.

  Es ist nicht nötig, eine Karte manuell zu duplizieren, einen Titel zu kopieren oder eine weitere URL zu verknüpfen.

  Dieselben Quelldaten werden überall dort wiederverwendet, wo sie benötigt werden.

  Bei einem Portfolio mit nur wenigen Projekten mag das wie eine kleine Verbesserung wirken.

  Mit dem Wachstum des Portfolios gewinnt sie zunehmend an Wert.

  ## Ausgewählte Projekte auf der Startseite

  Für die Startseite gilt ein ähnliches Prinzip.

  Im CMS lässt sich festlegen, ob ein Projekt auf der Startseite unter den ausgewählten Arbeiten erscheinen soll.

  Die Auswahl auf der Startseite wird dadurch von den Inhalten gesteuert, statt an mehreren Stellen manuell gepflegt zu werden.

  Das CMS verwaltet die Inhalte, die Templates steuern ihre Darstellung.

  ## Ein eigenes Veröffentlichungssystem für Blogartikel

  Der neue Blog folgt derselben grundlegenden Philosophie, ohne das wesentlich umfangreichere Projektschema zu kopieren.

  Blogartikel besitzen ein bewusst einfacheres Content-Modell, das für lange Beiträge ausgelegt ist.

  Das Blog-CMS umfasst Felder für:

  - Titel und Slug
  - Veröffentlichungsdatum und Status
  - Kennzeichnung als hervorgehobener Beitrag
  - Kategorie und Tags
  - Kurzbeschreibung
  - Titelbild
  - Autor
  - Artikelinhalt in Markdown
  - optional verknüpftes Projekt
  - SEO-Titel und -Beschreibung
  - Open-Graph-Bild

  Veröffentlichte Artikel werden beim Build erzeugt und erscheinen automatisch in der Übersicht unter `/blog/`.

  Entwürfe können im CMS verbleiben, ohne in den produktiven Blog aufgenommen zu werden.

  So verfügt die Website über zwei zweckgebundene Veröffentlichungsworkflows, während beide Systeme Teil derselben Git-basierten Architektur bleiben.

  ## Nutzerverhalten analysieren und verstehen

  Das Portfolio verwendet außerdem Microsoft Clarity.

  Clarity stellt Heatmaps und Sitzungsaufzeichnungen bereit. Damit kann ich nachvollziehen, wie Besucher tatsächlich mit der Website interagieren.

  So kann ich beispielsweise beobachten:

  - wie weit Besucher scrollen
  - mit welchen Elementen sie interagieren
  - an welchen Stellen Nutzer innehalten
  - ob bestimmte Handlungsaufforderungen ignoriert werden
  - wo sich die Nutzererfahrung verbessern lässt

  Zukünftige Verbesserungen müssen dadurch nicht ausschließlich auf Annahmen beruhen.

  ## Ist das günstiger als Webflow-Hosting?

  Für dieses konkrete Projekt: ja.

  Die Kosten zu senken war jedoch weder der einzige noch der wichtigste Grund für die Migration.

  Webflow bleibt ein nützliches Entwicklungswerkzeug. Es ging lediglich um die Frage, ob diese konkrete Website nach den veränderten Anforderungen weiterhin das Hosting-Modell von Webflow benötigte.

  Das Portfolio läuft nun auf einem Hosting-Paket, das ich bereits nutze. Pages CMS, GitHub und GitHub Actions stellen den Content- und Veröffentlichungsworkflow bereit, ohne ein weiteres klassisches kostenpflichtiges CMS zu erfordern.

  Dadurch sinken die speziell mit dem Portfolio verbundenen laufenden Kosten.

  Gleichzeitig erhielt ich:

  - direkte Kontrolle über den Quellcode
  - Kontrolle über das Hosting
  - Git-Versionshistorie
  - eine visuelle CMS-Oberfläche
  - wiederverwendbare Templates
  - statische Seitengenerierung
  - automatisierte Bereitstellung
  - getrennte Veröffentlichungssysteme für Projekte und Blogartikel
  - die Möglichkeit, die Architektur an zukünftige Anforderungen anzupassen

  Es geht also nicht einfach um die Aussage:

  **„Es ist günstiger als Webflow.“**

  Treffender ist:

  **Für die Anforderungen dieses Projekts gewann ich mehr Kontrolle und Flexibilität und konnte zugleich die langfristigen Hosting-Kosten senken.**

  ## Was bleibt von Webflow?

  Eine ganze Menge.

  Und das ist beabsichtigt.

  Die Migration war nie als Versuch gedacht, Webflow aus dem Projekt zu entfernen, als wäre dessen ursprüngliche Verwendung eine falsche Entscheidung gewesen.

  Das ursprüngliche Webflow-Frontend bleibt die visuelle Grundlage der Website.

  HTML, CSS, responsive Struktur, Interaktionen und die in dieser Phase getroffenen Designentscheidungen wurden nicht verworfen, nur weil sich die Infrastruktur änderte.

  Stattdessen entwickelte sich das Projekt um ein bestehendes, bereits gut funktionierendes Frontend weiter.

  Für mich lässt sich dieser Entwicklungsweg so zusammenfassen:

  **Figma → Webflow → Export → selbst gehosteter Betrieb → Eleventy → Pages CMS → GitHub → GitHub Actions → automatisierte Bereitstellung**

  Jede Ebene wurde eingeführt, als es dafür einen konkreten Grund gab.

  ## Aktuelle Architektur

  Heute kombiniert das Portfolio mehrere vergleichsweise einfache Technologien.

  **Frontend**  

  HTML5, CSS3, JavaScript, jQuery und GSAP.

  **Statische Generierung**  

  Eleventy und Nunjucks.

  **Inhalte**  

  Markdown.

  **CMS**  

  Pages CMS.

  **Versionskontrolle**  

  Git und GitHub.

  **Backend-Funktionalität**  

  PHP zur Verarbeitung des Kontaktformulars.

  **Sicherheit**  

  Cloudflare Turnstile.

  **Deployment**  

  GitHub Actions und FTP.

  **Hosting**  

  Hostinger.

  **UX-Analyse**  

  Microsoft Clarity.

  Keine dieser Technologien ist für sich genommen besonders kompliziert.

  Der Wert entsteht durch ihr Zusammenspiel.

  ## Was ich aus dem Projekt gelernt habe

  Eine der wichtigsten Erkenntnisse war, dass eine Migration nicht automatisch einen vollständigen Neuaufbau erfordert.

  Wenn ein bestehendes Frontend gut funktioniert, kann es sinnvoller sein, dieses zu bewahren und nur die Ebenen zu ersetzen, die Einschränkungen verursachen.

  Eine weitere Erkenntnis war, dass ein CMS nicht automatisch eine Datenbank, eine API und ein komplexes Backend benötigt.

  Für ein Portfolio oder eine ähnliche inhaltsorientierte Website kann folgende Kombination eine sehr wirkungsvolle Architektur bilden:

  **Markdown + Git + Static-Site-Generator + CMS-Oberfläche**

  Die dritte Erkenntnis betraf das Deployment.

  Automatisierung kann unnötig erscheinen, wenn sich eine Website nur alle paar Monate ändert. Sobald jedoch ein CMS eingeführt wird und regelmäßig neue Inhalte erscheinen, wird die manuelle Bereitstellung zu einer vermeidbaren Hürde.

  Die vielleicht wichtigste Erkenntnis lautet:

  **Wähle die Technologie passend zum Problem. Passe nicht das Problem an die Technologie an.**

  Die SSH-Bereitstellung funktionierte in dieser konkreten Shared-Hosting-Umgebung nicht wie gewünscht. Statt das System unnötig zu verkomplizieren, passte ich den Bereitstellungsmechanismus an und verwendete ein eingeschränktes FTP-Konto.

  Das Ergebnis ist ein einfacheres System, das zuverlässig funktioniert.

  ## Das Ergebnis

  Was als persönliches Webflow-Portfolio begann, ist heute mehr als eine Sammlung statischer Seiten.

  Es wurde zu einer kleinen Content-Plattform, die ich unabhängig entwickeln und pflegen kann.

  Ein neues Projekt kann den vollständigen Workflow durchlaufen:

  **Pages CMS → GitHub → Build → Deployment → Produktion**

  Ein neuer Blogartikel kann denselben Workflow über sein eigenes Content-Modell durchlaufen.

  Produktions-HTML muss nicht manuell bearbeitet werden, und nach Inhaltsaktualisierungen ist kein Upload generierter Dateien erforderlich.

  Gleichzeitig bleibt das ursprüngliche Design erhalten.

  Die Website ist online, doch das Projekt besitzt keinen klassischen „fertigen“ Zustand. Es wird kontinuierlich gepflegt und weiterentwickelt.

  Wenn neue Projekte, Artikel, Leistungen und Werkzeuge entstehen, kann sich dieselbe Plattform gemeinsam mit dem Portfolio weiterentwickeln.

  ## Projekt ansehen

  Wer die Umsetzung aus Projektperspektive betrachten möchte, findet weitere Details in der vollständigen **Fallstudie zur persönlichen Portfolio-Website**:

  [Fallstudie zur persönlichen Portfolio-Website ansehen](/de/projects/personal-portfolio-website/)

  Außerdem kann die Live-Website direkt aufgerufen werden:

  [Portfolio von Igor Mihajlovski besuchen](https://igormihajlovski.com/)

  ## Fazit

  Dieses Projekt ist für mich besonders interessant, weil es zwei unterschiedliche Seiten der Webentwicklung miteinander verbindet.

  Die erste ist visuell: Figma, Webflow, responsives Design, Interaktionen und Nutzererfahrung.

  Die zweite ist strukturell: Content-Architektur, Templates, CMS, Git, CI/CD, Hosting und Automatisierung.

  Ich musste mich nicht zwischen der visuellen und der strukturellen Seite entscheiden.

  Webflow schuf eine starke Grundlage für das Frontend. Durch die spätere Migration konnte ich um diese Grundlage herum ein eigenes Entwicklungs- und Veröffentlichungssystem aufbauen.

  Das Ergebnis ist nicht einfach ein Portfolio, das anders aussieht.

  Es ist ein Portfolio, das **anders gepflegt, weiterentwickelt und veröffentlicht wird**.
related_project_translation_id: project-personal-portfolio-website
related_project_label: Fallstudie zur persönlichen Portfolio-Website ansehen
related_project_url: /de/projects/personal-portfolio-website/
seo:
  title: Von Webflow zum selbst gehosteten CMS-Portfolio
  description: Wie mein Webflow-Portfolio mit Eleventy, Pages CMS, GitHub Actions und automatisierter Bereitstellung bei Hostinger zur selbst gehosteten CMS-Plattform wurde.
  og_image: /images/Featured-image-Portfolio-p-1080.png
---
