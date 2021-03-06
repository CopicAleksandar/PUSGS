﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class StationEditController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        public IUnitOfWork Db { get; set; }

        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;

        public StationEditController() { }

        public StationEditController(IUnitOfWork db)
        {
            this.Db = db;
        }

        // GET: api/StationEdit/GetStations
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(List<string>))]
        [Route("api/StationEdit/GetStations")]
        public IHttpActionResult GetStations()
        {
            var ret = new List<string>();

            var stations = Db.stationRepository.GetAll().ToList();

            foreach (var l in stations)
                ret.Add(l.Name);

            return Ok(ret);
        }

        // GET: api/StationEdit/SelectedLine/{serial}
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Line))]
        [Route("api/StationEdit/SelectedLine/{serial}")]
        public IHttpActionResult GetSelectedLine(string serial)
        {
            var lines = Db.lineRepository.GetAll().ToList();
            var serialNumber = int.Parse(serial);

            foreach (var l in lines)
            {
                if (!l.SerialNumber.Equals(serialNumber))
                    continue;

                // resava problem prikaza Serial Number-a za liniju.
                // FIXME: BUDZ
                var ret = new Line()
                {
                    SerialNumber = serialNumber
                };
                return Ok(ret);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        // GET: api/StationEdit/GetStations/{serial}
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(List<string>))]
        [Route("api/StationEdit/GetLines/{name}")]
        public IHttpActionResult GetLines(string name)
        {
            var ret = new Station();
            var stations = Db.stationRepository.GetAll().ToList();

            foreach (var l in stations)
            {
                if (l.Name.Equals(name))
                {
                    ret = l;
                    break;
                }
            }

            var lines = Db.lineRepository.Find(x => x.Stations.Any(y => y.Id.Equals(ret.Id))).ToList();

            List<string> returnsList = new List<string>();

            foreach (var line in lines)
                returnsList.Add(line.SerialNumber.ToString());

            // cak i ako je lista prazna, to je ok.
            return Ok(returnsList);
        }

        // GET: api/StationEdit/GetSelectedStation/{name}
        //[Authorize(Roles = "Admin")]
        [ResponseType(typeof(Station))]
        [Route("api/StationEdit/GetSelectedStation/{name}")]
        public IHttpActionResult GetSelectedStation(string name)
        {
            var station = db.Station.FirstOrDefault(x => x.Name == name);

            var stations = db.Station.ToList();

            if (station == null)
                return NotFound();

            var lines = station.Lines.Select(s => s.Id.ToString()).ToList();

            var addStation = new AddStation()
            {
                Name = station.Name,
                Address = station.Address,
                Lines = lines,
                X = station.X,
                Y = station.Y
            };

            return Ok(addStation);
        }

        // POST: api/StationEdit/UpdateStation
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(string))]
        [Route("api/StationEdit/UpdateStation")]
        public IHttpActionResult UpdateStation(AddStation station)
        {
            var stations = db.Station.ToList();

            Station stationDb = null;
            foreach (var s in stations)
            {
                if (!s.Name.Equals(station.Name)) continue;

                stationDb = s;
                break;
            }

            if (stationDb == null)
                return StatusCode(HttpStatusCode.BadRequest);

            foreach (var line in station.Lines)
            {
                var found = false;

                var lineDb = (from l in db.Line.ToList() where l.SerialNumber.ToString() == line select l).First();
                if (lineDb == null)
                    continue;

                foreach (var l in stationDb.Lines)
                {
                    if (l.SerialNumber != int.Parse(line)) continue;

                    found = true;
                    break;
                }
                if (!found)
                    stationDb.Lines.Add(lineDb);
            }

            db.Entry(stationDb).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            return Ok("success");
        }

        // GET: api/StationEdit/GetAllLines
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(List<string>))]
        [Route("api/StationEdit/GetAllLines")]
        public IHttpActionResult GetAllLines()
        {
            var ret = new List<string>();

            var lines = Db.lineRepository.GetAll().ToList();

            foreach (var l in lines)
                ret.Add(l.SerialNumber.ToString());

            return Ok(ret);
        }

        // Dobro istestirati.

        // POST: api/StationEdit/AddStation
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(string))]
        [Route("api/StationEdit/AddStation")]
        public IHttpActionResult AddStation(AddStation station)
        {
            var exists = false;
            var stations = Db.stationRepository.GetAll().ToList();

            foreach (var l in stations)
            {
                if (!l.Name.Equals(station.Name)) continue;
                exists = true;
                break;
            }

            if (exists)
                return StatusCode(HttpStatusCode.BadRequest);

            var allLines = Db.lineRepository.GetAll().ToList();

            var lines = new List<Line>();
            foreach (var l in station.Lines)
            {
                var line = allLines.Find(_ => _.Id.ToString() == l);

                if (line == null)
                    continue;
                
                lines.Add(line);
            }

            var random = new Random();
            var maxX = 45.270244;
            var minX = 45.232297;
            var maxY = 19.844869;
            var minY = 19.789069;
            var ret = new Station
            {
                Name = station.Name,
                Address = station.Address,
                X = random.NextDouble() * (maxX - minX) + minX,
                Y = random.NextDouble() * (maxY - minY) + minY,
                Lines = lines 
            };

            Db.stationRepository.Add(ret);
            Db.Complete();

            return Ok("success");
        }

        // DELETE: api/StationEdit/DeleteSelectedStation/{serial}
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(string))]
        [Route("api/StationEdit/DeleteSelectedStation/{selectedStation}")]
        public IHttpActionResult DeleteSelectedStation(string selectedStation)
        {
            var station = db.Station.FirstOrDefault(x => x.Name == selectedStation);

            if (station == null)
                return NotFound();

            db.Station.Remove(station);
            db.SaveChanges();

            return Ok("success");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
                Db.Dispose();

            base.Dispose(disposing);
        }
    }
}