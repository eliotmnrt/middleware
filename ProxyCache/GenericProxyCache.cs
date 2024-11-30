using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using System.ServiceModel;


namespace CacheProxy
{
    [ServiceBehavior()]
    public class GenericProxyCache<T> : IGenericProxyCache<T>
    {
        private readonly ObjectCache _cache = MemoryCache.Default;
        public DateTimeOffset DtDefault { get; set; } = ObjectCache.InfiniteAbsoluteExpiration;

        // Get with default expiration
        public Task<string> Get(string cacheItemName)
        {
            return GetWithDateTimeOffset(cacheItemName, DtDefault);
        }

        // Get with expiration in seconds
        public Task<string> GetWithExpiration(string cacheItemName, double dtSeconds)
        {
            return GetWithDateTimeOffset(cacheItemName, DateTimeOffset.Now.AddSeconds(dtSeconds));
        }

        // Get with a specific expiration time
        public async Task<string> GetWithDateTimeOffset(string cacheItemName, DateTimeOffset dt)
        {
            if (!_cache.Contains(cacheItemName))
            {
                Console.WriteLine(cacheItemName);
                var client = new HttpClient();
                var response = await client.GetStringAsync(cacheItemName);
                _cache.Set(cacheItemName, response, dt);
                Console.WriteLine("RESPONSE LENGTH:"+response.Length);
                return response;
            }
            Console.WriteLine("LE CASSSSSSSSSSSSSSSHHHHHHHHHHHHHHHHHHHHHHHHHH a été utilisé pour l'élement" + cacheItemName);
            Console.WriteLine("CASH ITEM LENGTH:"+((string)_cache.Get(cacheItemName)).Length);
            return (string)_cache.Get(cacheItemName);
        }

        
    }

}