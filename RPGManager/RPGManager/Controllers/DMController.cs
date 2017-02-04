using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RPGManager.Controllers
{
    public class DMController : Controller
    {
        // GET: DM
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NewMonster()
        {

            PartialViewResult pv = PartialView("~/Views/Shared/_MonsterDetails.cshtml");
            return pv;
        }
    }
}