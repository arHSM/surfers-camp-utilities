from dotenv import load_dotenv
from os import getenv
from interactions import Client, ClientPresence, Intents, PresenceActivity

# from logging import basicConfig

# basicConfig(level=10)

load_dotenv()

TOKEN = getenv("TOKEN", "")

bot = Client(
    token=TOKEN,
    intents=Intents.GUILD_MEMBERS,
    presence=ClientPresence(
        status="dnd",
        activities=[PresenceActivity(name="Surfers", type=5)],
    ),
)

bot.load(".member", package="extensions")
bot.load(".roles", package="extensions")

try:
    bot.start()
except KeyboardInterrupt:
    print("Received sig-int, stopped bot...")
