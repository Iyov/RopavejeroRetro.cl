// ========== DATOS DE POSTS DE INSTAGRAM ==========
// Archivo con los posts simulados de Instagram para Ropavejero Retro

const INSTAGRAM_POSTS_DATA = [
    {
        id: 'ig_1',
        image: "img/Post01.jpeg?v=2026-01-25",
        title: "PS1 Sueltos | 25/Ene/26",
        description: `[❌] 1912 Tekken 3 (BL-L-Piquete) [PS1 (L)] $6K
[✅] 1914 Final Fantasy VII Disc 1 (GH-L) [PS1 (L)] $8K
[✅] 1915 Legend Of Dragoon Disc 1 (BL-L) [PS1 (L)] $8K
[✅] 1918 NBA Live 2002 (BL-L) [PS1 (L)] $3K
[✅] 3702 Parasite Eve disc-1&2 (BL-L) [PS1 (L)] $50K
[✅] 3703 Brave Fencer Musashi (BL-L) [PS1 (L)] $50K
[✅] 3704 Fighting Force [Collector's Edition] (CE-L) [PS1 (L)] $15K
[✅] 3705 Spongebob Squarepants Supersponge (BL-L) [PS1 (L)] $7K
[❌] 3706 Duke Nukem Total Meltdown (BL-L) [PS1 (L)] $10K
[✅] 3707 Driver (GH-L) [PS1 (L)] $8K
[❌] 3708 Gran Turismo (GH-L) [PS1 (L)] $10K
[❌] 3709 Crash Bash (GH-L) [PS1 (L)] $12K
[✅] 3710 Viewpoint (BL-L) [PS1 (L)] $15K

[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE

Siglas:
BL: Black Label
GH: Greatest Hits
CE: Collector's Edition
L: Loose: Suelto: Solo Juego`,
        link: "https://www.instagram.com/p/DT9A2Ytleo0/",
        media_type: 'IMAGE',
        date: '2026-01-25'
    },
    {
        id: 'ig_2',
        image: "img/Post02.jpeg?v=2026-01-25",
        title: "PS2 Sueltos [1] | 25/Ene/26",
        description: `[✅] 1919 Metal Gear Solid 2 [Trial Edition Demo Disc] (BL-L) [PS2 (L)] $12K
[❌] 1920 Teenage Mutant Ninja Turtles 2: Battle Nexus (BL-L) [PS2 (L)] $15K
[❌] 1922 Gran Turismo 3 (GH-CIB) [PS2 (L)] $4K
[✅] 1923 Dynasty Warriors 6 (BL-L) [PS2 (L)] $4K
[✅] 1924 Samurai Warriors 2 (BL-L) [PS2 (L)] $5K
[✅] 1925 True Crime New York City (BL-L) [PS2 (L)] $4K
[✅] 1926 Red Faction (BL-L) [PS2 (L)] $4K
[✅] 1927 Jak and Daxter The Precursor Legacy (GH-L) [PS2 (L)] $4K
[✅] 1929 Mx Unleashed (BL-L) [PS2 (L)] $3K
[❌] 1930 Open Season (BL-L) [PS2 (L)] $3K
[❌] 1931 Nicktoons Unite! (BL-L) [PS2 (L)] $2K
[✅] 1932 ATV Offroad Fury 2 (GH-L) [PS2 (L)] $4K
[❌] 1937 Tomb Raider Legend (BL-L) [PS2 (L)] $6K
[❌] 1938 Robotech Battlecry (BL-L) [PS2 (L)] $6K
[✅] 1944 SOCOM II (BL-L) [PS2 (L)] $4K
[✅] 1945 Mark Of Kri (BL-L) [PS2 (L)] $5K
[✅] 1946 Frequency (BL-L) [PS2 (L)] $4K
[✅] 1947 Nascar 07 (BL-L) [PS2 (L)] $2K
[✅] 1953 Nascar 08 (BL-L) [PS2 (L)] $3K
[✅] 1955 GTA Vice City (BL-L) [PS2 (L)] $10K
[❌] 1958 Jak 3 (BL-L) [PS2 (L)] $5K
[❌] 1959 Jak and Daxter The Precursor Legacy (GH-L) [PS2 (L)] $4K
[✅] 1960 DDR Supernova (BL-L) [PS2 (L)] $5K

[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE

Siglas:
BL: Black Label
GH: Greatest Hits
CE: Collector's Edition
L: Loose: Suelto: Solo Juego`,
        link: "https://www.instagram.com/p/DT9DcoHFd2v/",
        media_type: 'IMAGE',
        date: '2026-12-25'
    },
    {
        id: 'ig_3',
        image: "img/Post03.jpeg?v=2026-01-25",
        title: "PS2 Sueltos [2] | 25/Ene/26",
        description: `[✅] 3711 Mortal Kombat Deadly Alliance (GH-L) [PS2 (L)] $12K
[✅] 3712 Mortal Kombat Shaolin Monks (BL-L) [PS2 (L)] $25K
[❌] 3713 WWE Smackdown Here Comes the Pain (GH-L) [PS2 (L)] $20K
[✅] 3714 WWE Smackdown vs Raw 2007 (GH-L) [PS2 (L)] $12K
[✅] 3715 WWE Smackdown vs Raw 2008 (GH-L) [PS2 (L)] $12K
[✅] 3716 GTA III (BL-L) [PS2 (L)] $8K
[✅] 3717 GTA Vice City (BL-L) [PS2 (L)] $10K
[✅] 3718 GTA Vice City (BL-L) [PS2 (L)] $10K
[❌] 3719 Dragon Ball Z Budokai 3 (GH-L) [PS2 (L)] $18K
[✅] 3720 Star Wars Episode III Revenge of the Sith (BL-L) [PS2 (L)] $8K
[✅] 3721 Star Wars Episode III Revenge of the Sith (BL-L) [PS2 (L)] $8K
[✅] 3722 Sly 2 (GH-L) [PS2 (L)] $8K
[✅] 3723 Sly 3 (GH-L) [PS2 (L)] $8K
[✅] 3724 Tony Hawk Proving Ground (BL-L) [PS2 (L)] $7K
[✅] 3725 Tony Hawk Project 8 (BL-L) [PS2 (L)] $7K
[✅] 3726 Jak 3 (GH-L) [PS2 (L)] $7K
[✅] 3727 Gran Turismo 3 (BL-L) [PS2 (L)] $5K
[✅] 3728 Crash Bandicoot The Wrath of Cortex (BL-L) [PS2 (L)] $10K
[✅] 3729 Zone of the Enders 2nd Runner (BL-L) [PS2 (L)] $20K
[❌] 3730 Winning Eleven 7 (BL-L) [PS2 (L)] $7K
[✅] 3731 Rainbow Six Lockdown (BL-L) [PS2 (L)] $5K
[✅] 3732 Star Wars Starfighter (BL-L) [PS2 (L)] $5K
[✅] 3733 Ghost Recon 2 (BL-L) [PS2 (L)] $5K
[✅] 3734 Spiderman (BL-L-PAL) [PS2 (L)] $8K

[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE

Siglas:
BL: Black Label
GH: Greatest Hits
CE: Collector's Edition
L: Loose: Suelto: Solo Juego
PAL: Europeo`,
        link: "https://www.instagram.com/p/DT9E3WLFVc_/",
        media_type: 'IMAGE',
        date: '2026-01-25'
    },
    {
        id: 'ig_4',
        image: "img/Post04.jpeg?v=2026-01-25",
        title: "PS2 Sueltos [3] | 25/Ene/26",
        description: `[✅] 1962 NBA Street (BL-L) [PS2 (L)] $5K
[✅] 1963 NBA Street vol 2 (BL-L) [PS2 (L)] $5K
[✅] 1965 Star Ocean Till The End Of Time disc 1 (BL-L) [PS2 (L)] $6K
[✅] 1966 Scooby Doo Mystery Mayhem (BL-L) [PS2 (L)] $10K
[✅] 1967 Marvel Ultimate Alliance (BL-L) [PS2 (L)] $10K
[✅] 1968 Naruto Ultimate Ninja (GH-L) [PS2 (L)] $5K
[✅] 3735 Gran Turismo 4 (GH-L) [PS2 (L)] $7K
[✅] 3736 Test Drive (BL-L) [PS2 (L)] $6K
[✅] 3737 Motocross Mania 3 (BL-L) [PS2 (L)] $3K
[✅] 3738 Scooby Doo Night of 100 Frights (GH-L) [PS2 (L)] $12K

[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE

Siglas:
BL: Black Label
GH: Greatest Hits
CE: Collector's Edition
L: Loose: Suelto: Solo Juego`,
        link: "https://www.instagram.com/p/DT9KnueDCRX/",
        media_type: 'IMAGE',
        date: '2026-01-25'
    },
    {
        id: 'ig_5',
        image: "img/Post05.jpeg?v=2026-01-26",
        title: "Xbox, 360 Sueltos [1] | 26/Ene/26",
        description: `[✅] 1949 Halo 4 disc 1 (L) [X360 (L)] $3K
[✅] 1950 Arcade (L) [Xbox (L)] $3K
[✅] 3739 Counter Strike (BL-L) [Xbox (L)] $10K
[✅] 3740 Halo 2 (BL-L) [Xbox (L)] $8K
[✅] 3741 Halo 2 (BL-L) [Xbox (L)] $8K
[✅] 3742 Halo 2 (BL-L-Piquete) [Xbox (L)] $6K
[✅] 3743 Driver Parallel Lines (BL-L) [Xbox (L)] $5K
[✅] 3744 Ghost Recon Island Thunder (BL-L) [Xbox (L)] $4K
[✅] 3745 Outlaw Golf 2 (BL-L) [Xbox (L)] $3K
[✅] 3746 Halo 4 disc 1 (BL-L) [X360 (L)] $5K
[✅] 3747 Halo 4 disc 2 (BL-L) [X360 (L)] $5K
[✅] 3748 Dead Space 3 disc 1 (BL-L) [X360 (L)] $5K
[✅] 3749 Dead Space 3 disc 2 (BL-L) [X360 (L)] $5K
[✅] 3750 Assassin's Creed III disc 1 (BL-L) [X360 (L)] $4K
[✅] 3751 Assassin's Creed III disc 2 (BL-L) [X360 (L)] $4K
[✅] 3752 Assassin's Creed IV Black Flag disc 1 (BL-L) [X360 (L)] $4K
[✅] 3753 Assassin's Creed IV Black Flag disc 2 (BL-L) [X360 (L)] $4K
[✅] 3754 Mass Effect 2 disc 1 (PH-L) [X360 (L)] $4K
[✅] 3755 Mass Effect 2 disc 2 (PH-L) [X360 (L)] $4K
[✅] 3756 Halo 3 disc Multiplayer (BL-L) [X360 (L)] $4K

[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE

Siglas:
BL: Black Label
PH: Platinum Hits
L: Loose: Suelto: Solo Juego`,
        link: "https://www.instagram.com/p/DT_jklKla1G/",
        media_type: 'IMAGE',
        date: '2026-01-26'
    },
    {
        id: 'ig_6',
        image: "img/Post06.jpeg?v=2026-01-26",
        title: "Xbox 360 Sueltos [2] | 26/Ene/26",
        description: `[✅] 3757 Enemy Territory Quake Wars (BL-L) [X360 (L)] $8K
[✅] 3758 Call of Duty Ghosts disc 1 (BL-L) [X360 (L)] $4K
[✅] 3759 Call of Duty Ghosts disc 2 (BL-L) [X360 (L)] $4K
[✅] 3760 Call of Duty World at War (PH-L) [X360 (L)] $8K
[✅] 3761 Elder Scrolls V Skyrim (BL-L) [X360 (L)] $4K
[✅] 3762 Metro Last Light (BL-L) [X360 (L)] $10K
[✅] 3763 Metro 2033 (BL-L) [X360 (L)] $10K
[✅] 3764 Fable Anniversary (BL-L) [X360 (L)] $20K
[✅] 3765 Forza Motorsport 2 (BL-L) [X360 (L)] $5K
[✅] 3766 Dead Rising (PH-L) [X360 (L)] $5K
[✅] 3767 Saints Row The Third disc 2 (BL-L) [X360 (L)] $3K
[✅] 3768 Dishonored (BL-L) [X360 (L)] $5K
[✅] 3769 Disney Infinity 3.0 (BL-L) [X360 (L)] $5K
[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE
Siglas:
BL: Black Label
PH: Platinum Hits
L: Loose: Suelto: Solo Juego`,
        link: "https://www.instagram.com/p/DT_lna2Fdws/",
        media_type: 'IMAGE',
        date: '2026-01-26'
    },
    {
        id: 'ig_7',
        image: "img/Post07.jpeg?v=2026-01-26",
        title: "[✅] 3770 Rad Racer [NES] $12K",
        description: `[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE`,
        link: "https://www.instagram.com/p/DT_mzZsFQYD/",
        media_type: 'IMAGE',
        date: '2026-01-26'
    },
    {
        id: 'ig_8',
        image: "img/Post08.jpeg?v=2026-01-26",
        title: "Xbox 360 [1] | 26/Ene/26",
        description: `[✅] 3771 Kinect Nat Geo TV (Sealed-K) [X360] $8K
[✅] 3772 Biggest Loser Ultimate Workout (Sealed-K) [X360] $8K
[❌] 3773 Dance Central 1 (CIB+-K) [X360] $7K
[✅] 3774 Dance Central 1 (CIB+-K) [X360] $7K
[❌] 3775 Dance Central 2 (CIB+-K) [X360] $8K
[✅] 3776 Dance Central 2 (CIB+-K) [X360] $8K
[✅] 3777 Dance Central 2 (CIB+-K) [X360] $8K
[✅] 3778 Dance Central 2 (CIB+-K) [X360] $8K
[❌] 3779 Dance Central 3 (CIB+-K) [X360] $8K
[❌] 3780 Just Dance 4 (MM-K) [X360] $4K
[✅] 3781 NBA Baller Beats (CIB+-K) [X360] $5K
[✅] 3782 Nike + Kinect Trainning (CIB+-K) [X360] $7K
[✅] 3783 Kinect Sports (CIB+-K) [X360] $5K
[✅] 3784 Kinect Sports (CIB+-K) [X360] $5K
[✅] 3785 Kinect Sports (CIB+-K) [X360] $5K
[✅] 3786 Kinect Sports (MM-K) [X360] $4K
[✅] 3787 Kinect Sports 2da Temporada (CIB-K-DC) [X360] $5K
[✅] 3788 Kinect Disneyland Adventures (CIB+-K) [X360] $6K
[✅] 3789 Kinect Sesame Street TV (MM-K-2D) [X360] $7K
[✅] 3790 Your Shape Fitness Evolved (CIB+-K) [X360] $5K
[✅] 3791 Your Shape Fitness Evolved (CIB-K) [X360] $5K
[✅] 3792 Your Shape Fitness Evolved (MM-K) [X360] $4K
[✅] 3793 Your Shape Fitness Evolved 2012 (CIB+-K) [X360] $5K
[❌]: VENDIDO
[R]: RESERVADO
[✅]: DISPONIBLE
Siglas:
BL: Black Label
PH: Platinum Hits
CIB: Caja, Juego, Manual
CIB+: Caja, Juego, Manual, Insertos
MM: Sin Manual
S: Sealed: Sellado de Fábrica
K: Kinect
DC: Daño en Carátula
2D: Dos Discos`,
        link: "https://www.instagram.com/p/DT_tCk9jHOH/",
        media_type: 'IMAGE',
        date: '2026-01-26'
    },
    {
        id: 'ig_9',
        image: "img/Post09.jpeg?v=2025-12-31",
        title: "Feliz Navidad y Próspero Año Nuevo 2026.",
        description: `Esperamos que pasen un feliz año 2026, lleno de bendiciones, éxito y salud. 
Muchas gracias 2025 por todo y allá vamos 2026!`,
        link: "https://www.instagram.com/p/DS82t4FFa2x/",
        media_type: 'IMAGE',
        date: '2025-12-31'
    }
];

// Función para obtener los posts de Instagram
function getInstagramPostsData() {
    return INSTAGRAM_POSTS_DATA;
}