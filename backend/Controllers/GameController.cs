using Microsoft.AspNetCore.Mvc;
using Model;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private static Game game = InitGame();

        private static Game InitGame()
        {
            var g = new Game();
            g.AddPlayer("Gracz 1");
            g.AddPlayer("Gracz 2");
            return g;
        }

        [HttpGet("state")]
        public IActionResult GetState()
        {
            return Ok(new
            {
                currentPlayer = game.CurrentPlayer.Name,
                players = game.Players.Select(p => new
                {
                    name = p.Name,
                    animals = p.Animals
                }).ToList()
            });
        }

        [HttpPost("roll")]
        public IActionResult Roll()
        {
            var (d1, d2) = game.RollDice();
            var changes = game.ResolveAnimals(game.CurrentPlayer, d1, d2);
            var win = game.CurrentPlayer.HasFullHerd();

            var result = new
            {
                dice = new[] { d1, d2 },
                player = game.CurrentPlayer.Name,
                changes = changes,
                winner = win ? game.CurrentPlayer.Name : null
            };

            game.NextTurn();
            return Ok(result);
        }

        [HttpPost("exchange")]
        public IActionResult Exchange([FromQuery] Model.AnimalType from, [FromQuery] Model.AnimalType to, [FromQuery] int amount)
        {
            bool success = game.TryExchange(game.CurrentPlayer, from, to, amount);
            return success ? Ok() : BadRequest("Wymiana nieudana");
        }

        [HttpPost("restart")]
        public IActionResult RestartGame()
        {
            game = new Game();
            game.AddPlayer("Gracz 1");
            game.AddPlayer("Gracz 2");
            return Ok();
        }

        [HttpGet("stock")]
        public IActionResult GetStock()
        {
            return Ok(game.HerdStock);
        }

    }
}
