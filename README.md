# ![alt text](logo_transparrent_white.svg) ReTicket
### Colaborators:
- Patkós Dominik (pdomi06)
- Molnár Attila (En1ry06)
- Fodor Tamás Krisztián (jobbagy06)
## What is ReTicket?
ReTicket is a program designed to eliminate scams in the second-hand market. It's purpose to give the users a safe shopping experience through it's designed webshop both vendors and buyers.

# Front-end development

#### Our color palette
- Main: #001a20 (Dark Teal - primary background)
- Secondary: #0a2e38 (Darker Teal - card backgrounds)
- Purple Accent: #b19cd9 (Lavender - badges, borders, accents)
- Text: #ffffff (White - primary text)
- Text Secondary: #b0b0b0 (Light Gray - secondary text, placeholders)
- Dark Overlay: rgba(0, 0, 0, 0.9) (Black with opacity - gradient overlays)
- Highlighter: #ffd700 (Gold - "Hot" badges, important CTAs)
#### Font types:
- Main: Noto Sans
- Secondary: Playfair display
## Landing page
This page is the very first page the customer/user visits. The main purpose is quick and easy access to everything the user may want, while maintaining a modern and clean look.

### Structure
- At the top, there is always the navbar with a few basic links (sales page, login/register, home).
- After that, a sliding carousel showing the biggest performances coming up.
- Then a section with search filters for quick event discovery.
- Below the search bar, there is a card-based category selector to lead the user directly to the genre they are interested in (music, cultural, sports, comedy).
- Followed by a "Trending Events" section showcasing popular events with sales metrics.
- A "Why Choose ReTicket?" feature highlights section explaining key benefits.
- Finally, a call-to-action section encouraging users to sell tickets.

### Micro-interactions & Effects
- **Smooth Scrolling**: Native smooth scroll behavior for all page navigation
- **Scroll Animations**: 
  - FadeInUp animations for search bar and feature sections
  - Staggered fadeInScale animations for category cards (0.2s delays)
- **Custom Scrollbar**: Purple gradient scrollbar matching brand colors
- **Icon Animations**: SVG icons scale and brighten on card hover
- **Glassmorphism**: Backdrop blur effect on search bar section

### Bootstrap Measurements

#### Carousel
- Height: 500px
- Full-width responsive carousel with text captions positioned at bottom

#### Search Bar
- Small (xs): 1 input per row 
- Small tablets (sm): 2 inputs per row
- Medium (md): 3 inputs per row
- Large (lg): 5 inputs per row
- Input height: 48px with proper spacing and focus states

#### Cards
- Small (xs): 1 card per row 
- Small tablets (sm): 2 cards per row
- Medium (md): 3 cards per row
- Large (lg): 5 cards per row
- Card height: min 350px with 1:1.1 aspect ratio
- Hover effect: translateY(-8px) with shadow

#### Trending Events
- Small (xs): 1 event per row
- Medium (md): 2 events per row
- Large (lg): 3 events per row
- Fixed height image: 200px with object-fit cover

#### Features ("Why Choose ReTicket?")
- Small (xs): 1 feature per row
- Medium (md): 2 features per row
- Large (lg): 4 features per row
- Icon size: 60px diameter circles
- Text-centered layout with equal padding

### Features
- Responsive design that works on all screen sizes
- Smooth hover animations and transitions
- Clean, modern aesthetic with proper spacing
- Accessible form controls with focus states
- Call-to-action section for vendor engagement
