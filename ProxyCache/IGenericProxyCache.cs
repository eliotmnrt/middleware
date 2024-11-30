using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;


namespace CacheProxy
{
    [ServiceContract()]
    internal interface IGenericProxyCache<T>
    {
        [OperationContract]
        Task<string> Get(string cacheItemName);
        [OperationContract()]

        Task<string> GetWithExpiration(string cacheItemName, double dtSeconds);
        [OperationContract()]

        Task<string> GetWithDateTimeOffset(string cacheItemName, DateTimeOffset dt);

        

    }
}