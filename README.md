# Hamna Ahmed — Portfolio

A minimal, gradient-forward portfolio website built from Figma design.

## Features

- **Gradient design**: Soft gradients on project cards (blue-purple → pink-orange, yellow-orange → pink)
- **Nav button gradient**: Active "work" link with subtle grey gradient oval
- **Frosted glass cards**: Glassmorphism on project and contact cards
- **Gradient borders**: Red-to-orange-yellow accent on project thumbnails
- **Page background**: Soft lavender-to-green gradient
- **Responsive**: Mobile-friendly layout

## Running locally

Open `index.html` in a browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`

## Customization

- **Project thumbnails**: Replace the `.project-card__thumbnail` background with real screenshots by adding `<img>` tags or background-image URLs
- **Resume link**: Update `resume.pdf` in the nav to your resume URL
- **Social links**: Edit the LinkedIn and GitHub URLs in the contact section
- **Email**: Already set to ahmedhamna2002@gmail.com

## File structure

```
portfolio/
├── index.html
├── styles.css
├── script.js
└── README.md
```
