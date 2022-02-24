﻿using Aquarium.Infrastructure.Classes;
using Aquarium.Infrastructure.Enums;
using Microsoft.Extensions.Logging;

namespace Aquarium.Infrastructure.BackgroundServices;

public class Worker : BackgroundService
{
    readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        
    }
}