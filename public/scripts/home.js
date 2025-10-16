// Scripts para la página principal

let matrixInterval = null;
let animating = false;
let drops = [];
let columns = 0;
let fontSize = 22;

let commandHistory = [];
let historyIndex = -1;

function startMatrixRain() {
	const canvas = document.getElementById('matrix-canvas');
	if (!(canvas instanceof HTMLCanvasElement)) return;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	// Ajustar tamaño
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Caracteres Matrix
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
	fontSize = 22;
	columns = Math.floor(canvas.width / fontSize);
	drops = Array(columns).fill(1);

	function draw() {
		if (!ctx || !(canvas instanceof HTMLCanvasElement)) return;
		ctx.fillStyle = 'rgba(24, 27, 43, 0.18)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = `${fontSize}px monospace`;
		ctx.textAlign = 'center';
		for (let i = 0; i < columns; i++) {
			ctx.shadowColor = Math.random() > 0.5 ? '#e11d74' : '#3B82F6';
			ctx.shadowBlur = 12;
			ctx.fillStyle = Math.random() > 0.5 ? '#e11d74' : '#3B82F6';
			const text = letters[Math.floor(Math.random() * letters.length)];
			ctx.fillText(text, i * fontSize + fontSize / 2, drops[i] * fontSize);
			if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
				drops[i] = 0;
			}
			drops[i]++;
		}
	}

	if (matrixInterval) clearInterval(matrixInterval);
	matrixInterval = setInterval(draw, 40);
}

function stopMatrixRain() {
	if (matrixInterval) {
		clearInterval(matrixInterval);
		matrixInterval = null;
	}
	// Limpiar el canvas
	const canvas = document.getElementById('matrix-canvas');
	if (canvas instanceof HTMLCanvasElement) {
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}
}

function showKGLText() {
	// Eliminar cualquier texto KGL previo
	const prev = document.body.querySelector('.matrix-kgl');
	if (prev) prev.remove();
	const kglText = document.createElement('div');
	kglText.className = 'matrix-kgl';
	kglText.textContent = 'KGL';
	document.body.appendChild(kglText);
	setTimeout(() => {
		kglText.remove();
	}, 3000);
}

function handleEasterEggClick(btn) {
	const svg = btn.querySelector('#easter-egg-svg');
	const msg = btn.closest('div')?.querySelector('#easter-egg-msg');
	if (!animating && svg && msg) {
		animating = true;
		svg.classList.add('easter-egg-glitch');
		btn.classList.add('easter-egg-flash');
		msg.classList.remove('hidden');
		setTimeout(() => {
			svg.classList.remove('easter-egg-glitch');
			btn.classList.remove('easter-egg-flash');
			animating = false;
		}, 1400);
		setTimeout(() => {
			msg.classList.add('hidden');
		}, 3500);
		// Efecto Matrix Rain
		const matrixContainer = document.getElementById('matrix-container');
		if (matrixContainer) {
			matrixContainer.style.opacity = '1';
			startMatrixRain();
			showKGLText();
			setTimeout(() => {
				matrixContainer.style.opacity = '0';
				stopMatrixRain();
			}, 3000);
		}
	}
}

// Terminal Interactiva adaptada a móvil y escritorio
function getTerminalElements() {
	if (window.innerWidth < 768) {
		// Móvil
		return {
			input: document.getElementById('terminal-input-mobile'),
			output: document.getElementById('terminal-output-mobile')
		};
	} else {
		// Escritorio
		return {
			input: document.getElementById('terminal-input-desktop'),
			output: document.getElementById('terminal-output-desktop')
		};
	}
}

const projectsList = [
	{
		name: 'Portfolio KGL',
		tech: 'Astro, React, TailwindCSS',
		desc: 'Mi portafolio personal con efectos cyberpunk, terminal interactiva y animaciones.'
	},
	{
		name: 'API de Tareas',
		tech: 'Node.js, Express, MongoDB, C#',
		desc: 'API RESTful para gestión de tareas, con autenticación y panel de administración.'
	},
	{
		name: 'E-commerce Moderno',
		tech: 'React, C#, .NET, PostgreSQL',
		desc: 'Tienda online con pasarela de pagos, panel de usuario y dashboard de ventas.'
	},
	{
		name: 'App de Notas',
		tech: 'Vue, Firebase',
		desc: 'Aplicación web para tomar notas rápidas, sincronización en tiempo real y modo oscuro.'
	}
];

const commands = {
	help: () => `
Comandos disponibles:
- about: Información sobre mí
- skills: Mis habilidades técnicas
- projects: Ver mis proyectos
- clear: Limpiar terminal
- matrix: Activar efecto matrix
- contact: Información de contacto
- exit: Cerrar terminal
	`,
	about: () => `
Sobre mí:
Desarrollador Full Stack apasionado por crear experiencias web únicas.
Especializado en React, Node.js y tecnologías modernas.
Siempre buscando nuevos desafíos y oportunidades de aprendizaje.
	`,
	skills: () => `
Habilidades técnicas:
Frontend: React, Astro, TailwindCSS
Backend: Node.js, Express, Python, C#
Database: MongoDB, PostgreSQL
DevOps: Git, CI/CD
Otros: .NET, TypeScript
	`,
	projects: (num) => {
		if (!num) {
			let list = 'Proyectos destacados:';
			projectsList.forEach((p, i) => {
				list += `\n${i + 1}. ${p.name} [${p.tech}]`;
			});
			list += "\nEscribe 'projects <número>' para ver detalles";
			return list;
		} else {
			const idx = parseInt(num) - 1;
			if (projectsList[idx]) {
				const p = projectsList[idx];
				return `Proyecto: ${p.name}\nTecnologías: ${p.tech}\nDescripción: ${p.desc}`;
			} else {
				return 'Error: Proyecto no encontrado.';
			}
		}
	},
	clear: () => {
		const { output } = getTerminalElements();
		if (output) output.innerHTML = '';
		return '✓ Terminal limpiada';
	},
	matrix: () => {
		const matrixContainer = document.getElementById('matrix-container');
		if (matrixContainer) {
			matrixContainer.style.opacity = '1';
			startMatrixRain();
			setTimeout(() => {
				matrixContainer.style.opacity = '0';
				stopMatrixRain();
			}, 3000);
		}
		return '✓ Efecto Matrix activado';
	},
	contact: () => `
Contacto:
Email: kevin.gonzalez04@outlook.com
LinkedIn: linkedin.com/in/kevingonzalezlister
GitHub: github.com/https://github.com/keymers
	`,
	exit: () => {
		const { input } = getTerminalElements();
		if (input) input.blur();
		return '✓ Terminal cerrada. Escribe cualquier comando para reactivar.';
	}
};

function addToOutput(text, isCommand = false, type = 'response') {
	const { output } = getTerminalElements();
	if (!output) return;
	const line = document.createElement('div');
	line.className = 'terminal-line';
	
	if (isCommand) {
		line.innerHTML = `<span class="terminal-command">$ ${text}</span>`;
	} else {
		switch (type) {
			case 'welcome':
				line.className += ' terminal-welcome';
				break;
			case 'error':
				line.className += ' terminal-error';
				break;
			case 'success':
				line.className += ' terminal-success';
				break;
			case 'info':
				line.className += ' terminal-info';
				break;
			default:
				line.className += ' terminal-response';
		}
		line.textContent = text;
	}
	output.appendChild(line);
	output.scrollTop = output.scrollHeight;
}

function processCommand(cmd) {
	const [command, ...args] = cmd.trim().toLowerCase().split(' ');
	const { output } = getTerminalElements();
	
	if (command === '') return;
	
	if (output) {
		output.innerHTML = '';
		addToOutput('Bienvenido al sistema KGL v1.0', false, 'welcome');
		addToOutput('Escribe \'help\' para ver los comandos disponibles', false, 'info');
		addToOutput('----------------------------------------', false, 'welcome');
	}
	
	addToOutput(cmd, true);
	
	if (command in commands) {
		let result;
		if (command === 'projects' && args.length > 0) {
			result = commands[command](args[0]);
		} else {
			result = commands[command](...args);
		}
		if (result) {
			result.split('\n').forEach((line) => {
				const trimmedLine = line.trim();
				if (trimmedLine.startsWith('Error:')) {
					addToOutput(trimmedLine, false, 'error');
				} else if (trimmedLine.startsWith('✓') || trimmedLine.includes('activado')) {
					addToOutput(trimmedLine, false, 'success');
				} else if (trimmedLine.startsWith('Comandos disponibles:') || trimmedLine.startsWith('Escribe')) {
					addToOutput(trimmedLine, false, 'info');
				} else {
					addToOutput(trimmedLine, false, 'response');
				}
			});
		}
	} else {
		addToOutput(`Error: Comando no reconocido: ${command}. Escribe 'help' para ver los comandos disponibles.`, false, 'error');
	}
}

function setupTerminalListeners() {
	const { input } = getTerminalElements();
	if (!input) return;
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			const command = input.value.trim();
			if (command) {
				commandHistory.push(command);
				historyIndex = commandHistory.length;
				processCommand(command);
				input.value = '';
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				input.value = commandHistory[historyIndex];
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				input.value = commandHistory[historyIndex];
			} else {
				historyIndex = commandHistory.length;
				input.value = '';
			}
		}
	});
	input.addEventListener('focus', () => {
		input.parentElement?.classList.add('border-accent');
	});
	input.addEventListener('blur', () => {
		input.parentElement?.classList.remove('border-accent');
	});
}

// Inicialización cuando el DOM esté listo
function initTerminal() {
	setupTerminalListeners();
}

document.addEventListener('DOMContentLoaded', function() {
	// Event listeners para Easter Egg
	const btnMobile = document.getElementById('easter-egg-btn-mobile');
	const btnDesktop = document.getElementById('easter-egg-btn-desktop');
	
	if (btnMobile) {
		btnMobile.addEventListener('click', () => handleEasterEggClick(btnMobile));
	}
	if (btnDesktop) {
		btnDesktop.addEventListener('click', () => handleEasterEggClick(btnDesktop));
	}

	// Event listener para redimensionamiento
	window.addEventListener('resize', () => {
		if (matrixInterval) {
			stopMatrixRain();
			startMatrixRain();
		}
		// Reasignar listeners al cambiar de tamaño
		initTerminal();
	});

	initTerminal();
}); 